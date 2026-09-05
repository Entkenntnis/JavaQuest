import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.EOFException;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import javax.tools.Diagnostic;
import javax.tools.DiagnosticCollector;
import javax.tools.FileObject;
import javax.tools.ForwardingJavaFileManager;
import javax.tools.JavaCompiler;
import javax.tools.JavaFileManager;
import javax.tools.JavaFileObject;
import javax.tools.SimpleJavaFileObject;
import javax.tools.StandardJavaFileManager;
import javax.tools.ToolProvider;

public class Harness {
  private static final PrintStream CTRL = System.out;
  private static final String NEWLINE = System.lineSeparator();

  public static void main(String[] args) throws IOException {
    DataInputStream in = new DataInputStream(new BufferedInputStream(System.in));
    int seq = 0;
    while (true) {
      int length;
      try {
        length = in.readInt();
      } catch (EOFException eof) {
        break;
      }
      byte[] raw = new byte[length];
      in.readFully(raw);
      String code = new String(raw, StandardCharsets.UTF_8);
      handle("T" + seq, code);
      seq += 1;
    }
  }

  // Each request on stdin: int32 length + utf8 bytes of the expression.
  // Each response on stdout: byte status (1 = value, 2 = error), then payload.
  private static void handle(String className, String code) throws IOException {
    ByteArrayOutputStream frame = new ByteArrayOutputStream();
    DataOutputStream out = new DataOutputStream(frame);
    try {
      Map<String, byte[]> classes = compile(className, code);
      String printed = runMain(className, classes);
      byte[] body = printed.getBytes(StandardCharsets.UTF_8);
      out.writeByte(1);
      out.writeInt(body.length);
      out.write(body);
    } catch (CompileFailure failure) {
      writeError(out, 99, failure.getMessage());
    } catch (Throwable failure) {
      writeError(out, 114, messageOf(failure));
    }
    out.flush();
    CTRL.write(frame.toByteArray(), 0, frame.size());
    CTRL.flush();
  }

  private static void writeError(DataOutputStream out, int kind, String message)
      throws IOException {
    byte[] body = message.getBytes(StandardCharsets.UTF_8);
    out.writeByte(2);
    out.writeByte(kind);
    out.writeInt(body.length);
    out.write(body);
  }

  private static String messageOf(Throwable t) {
    if (t instanceof InvocationTargetException && t.getCause() != null) {
      t = t.getCause();
    }
    String message = t.getMessage();
    return message == null || message.isEmpty() ? t.toString() : message;
  }

  private static Map<String, byte[]> compile(String className, String code)
      throws CompileFailure {
    JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
    if (compiler == null) {
      throw new CompileFailure("no in-process java compiler available (JDK required)");
    }
    DiagnosticCollector<JavaFileObject> diagnostics = new DiagnosticCollector<>();
    MemFileManager fileManager;
    try {
      StandardJavaFileManager standard =
          compiler.getStandardFileManager(diagnostics, null, StandardCharsets.UTF_8);
      fileManager = new MemFileManager(standard);
    } catch (Exception e) {
      throw new CompileFailure("cannot create file manager: " + messageOf(e));
    }
    String wrapper =
        "public class "
            + className
            + " {"
            + NEWLINE
            + "  public static void main(String[] a){ Harness.out("
            + code
            + "); }"
            + NEWLINE
            + "}";
    Boolean success =
        compiler
            .getTask(
                null,
                fileManager,
                diagnostics,
                List.of("-encoding", "UTF-8"),
                null,
                List.of(new SourceFile(className, wrapper)))
            .call();
    if (success == null || !success.booleanValue()) {
      StringBuilder sb = new StringBuilder();
      for (Diagnostic<? extends JavaFileObject> d : diagnostics.getDiagnostics()) {
        if (d.getKind() == Diagnostic.Kind.ERROR) {
          if (sb.length() > 0) {
            sb.append(" | ");
          }
          sb.append(d.getMessage(Locale.ROOT));
        }
      }
      throw new CompileFailure(sb.length() == 0 ? "compilation failed" : sb.toString());
    }
    Map<String, byte[]> classes = new HashMap<>();
    for (Map.Entry<String, ByteArrayOutputStream> e : fileManager.outputs.entrySet()) {
      classes.put(e.getKey(), e.getValue().toByteArray());
    }
    return classes;
  }

  private static String runMain(String className, Map<String, byte[]> classes)
      throws Exception {
    ClassLoader loader =
        new ClassLoader(ClassLoader.getSystemClassLoader()) {
          @Override
          protected Class<?> findClass(String name) throws ClassNotFoundException {
            byte[] bytes = classes.get(name);
            if (bytes == null) {
              throw new ClassNotFoundException(name);
            }
            return defineClass(name, bytes, 0, bytes.length);
          }
        };
    Class<?> clazz = loader.loadClass(className);
    Method main = clazz.getMethod("main", String[].class);
    ByteArrayOutputStream captured = new ByteArrayOutputStream();
    PrintStream sink = new PrintStream(captured, true, StandardCharsets.UTF_8.name());
    PrintStream original = System.out;
    System.setOut(sink);
    try {
      main.invoke(null, (Object) new String[0]);
    } catch (InvocationTargetException e) {
      Throwable cause = e.getCause() == null ? e : e.getCause();
      if (cause instanceof Exception) {
        throw (Exception) cause;
      }
      throw new RuntimeException(cause);
    } finally {
      System.setOut(original);
      sink.flush();
    }
    return captured.toString(StandardCharsets.UTF_8.name()).trim();
  }

  public static void out(Object v) {
    if (v == null) {
      System.out.println("{\"type\":\"null\",\"value\": null}");
      return;
    }
    if (v instanceof Boolean) {
      System.out.println("{\"type\":\"boolean\",\"value\":" + v + "}");
    } else if (v instanceof Byte) {
      System.out.println("{\"type\":\"byte\",\"value\":" + ((Byte) v).intValue() + "}");
    } else if (v instanceof Short) {
      System.out.println("{\"type\":\"short\",\"value\":" + ((Short) v).intValue() + "}");
    } else if (v instanceof Integer) {
      System.out.println("{\"type\":\"int\",\"value\":" + v + "}");
    } else if (v instanceof Long) {
      System.out.println("{\"type\":\"long\",\"value\":\"" + v + "\"}");
    } else if (v instanceof Character) {
      System.out.println(
          "{\"type\":\"char\",\"value\":" + (int) ((Character) v).charValue() + "}");
    } else if (v instanceof Float) {
      float f = (Float) v;
      if (Float.isNaN(f)) {
        System.out.println("{\"type\":\"float\",\"special\":\"NaN\"}");
      } else if (Float.isInfinite(f)) {
        System.out.println(
            f > 0
                ? "{\"type\":\"float\",\"special\":\"Infinity\"}"
                : "{\"type\":\"float\",\"special\":\"-Infinity\"}");
      } else {
        System.out.println("{\"type\":\"float\",\"value\":" + Double.toString((double) f) + "}");
      }
    } else if (v instanceof Double) {
      double d = (Double) v;
      if (Double.isNaN(d)) {
        System.out.println("{\"type\":\"double\",\"special\":\"NaN\"}");
      } else if (Double.isInfinite(d)) {
        System.out.println(
            d > 0
                ? "{\"type\":\"double\",\"special\":\"Infinity\"}"
                : "{\"type\":\"double\",\"special\":\"-Infinity\"}");
      } else {
        System.out.println("{\"type\":\"double\",\"value\":" + Double.toString(d) + "}");
      }
    } else if (v instanceof String) {
      System.out.println("{\"type\":\"string\",\"value\":\"" + esc((String) v) + "\"}");
    } else {
      System.out.println("{\"type\":\"other\"}");
    }
  }

  private static String esc(String s) {
    StringBuilder b = new StringBuilder();
    for (char c : s.toCharArray()) {
      if (c == '\\' || c == '"') {
        b.append('\\').append(c);
      } else if (c < 32) {
        b.append(String.format("\\u%04x", (int) c));
      } else {
        b.append(c);
      }
    }
    return b.toString();
  }

  private static class CompileFailure extends Exception {
    CompileFailure(String message) {
      super(message);
    }
  }

  private static final class SourceFile extends SimpleJavaFileObject {
    private final String content;

    SourceFile(String className, String content) {
      super(
          URI.create("string:///" + className.replace('.', '/') + JavaFileObject.Kind.SOURCE.extension),
          JavaFileObject.Kind.SOURCE);
      this.content = content;
    }

    @Override
    public CharSequence getCharContent(boolean ignoreEncodingErrors) {
      return content;
    }
  }

  private static final class MemFileManager
      extends ForwardingJavaFileManager<StandardJavaFileManager> {
    final Map<String, ByteArrayOutputStream> outputs = new HashMap<>();

    MemFileManager(StandardJavaFileManager fileManager) {
      super(fileManager);
    }

    @Override
    public JavaFileObject getJavaFileForOutput(
        JavaFileManager.Location location,
        String className,
        JavaFileObject.Kind kind,
        FileObject sibling) {
      ByteArrayOutputStream stream = new ByteArrayOutputStream();
      outputs.put(className, stream);
      return new MemOutput(className, kind, stream);
    }
  }

  private static final class MemOutput extends SimpleJavaFileObject {
    private final ByteArrayOutputStream stream;

    MemOutput(String className, JavaFileObject.Kind kind, ByteArrayOutputStream stream) {
      super(URI.create("mem:///" + className.replace('.', '/') + kind.extension), kind);
      this.stream = stream;
    }

    @Override
    public OutputStream openOutputStream() {
      return stream;
    }
  }
}
