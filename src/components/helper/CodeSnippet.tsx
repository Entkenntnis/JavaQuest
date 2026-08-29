import { EditorState, StateEffect, StateField } from '@codemirror/state'
import {
  Decoration,
  EditorView,
  WidgetType,
  type DecorationSet,
} from '@codemirror/view'
import { useEffect, useRef } from 'react'
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { java } from '@codemirror/lang-java'

const setPlaceholder = StateEffect.define<{ from: number; to: number }>()

const placeholderField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none
  },
  update(decorations, tr) {
    decorations = decorations.map(tr.changes)

    for (const effect of tr.effects) {
      if (effect.is(setPlaceholder)) {
        const { from, to } = effect.value
        const deco = Decoration.replace({
          widget: new PlaceholderWidget(),
        })
        decorations = Decoration.set([deco.range(from, to)])
      }
    }

    return decorations
  },
  provide(f) {
    return EditorView.decorations.from(f)
  },
})

class PlaceholderWidget extends WidgetType {
  constructor() {
    super()
  }

  toDOM(): HTMLElement {
    const span = document.createElement('span')
    span.textContent = '???'
    span.style.color = '#999'
    span.style.fontStyle = 'italic'
    span.style.paddingLeft = '24px'
    span.style.paddingRight = '24px'
    span.style.backgroundColor = '#333'
    return span
  }
}

export function CodeSnippet() {
  const editorDiv = useRef(null)

  useEffect(() => {
    const currentEditor = editorDiv.current
    if (!currentEditor) return

    const view: EditorView = new EditorView({
      state: EditorState.create({
        doc: 'class Program {\n  public static void main(String[] args) {\n    System.out.println("test");\n  }\n}',
        extensions: [
          EditorView.editable.of(false),
          EditorState.readOnly.of(true),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          java(),
          placeholderField,
        ],
      }),
      parent: currentEditor,
    })

    view.dispatch({ effects: setPlaceholder.of({ from: 82, to: 88 }) })

    return () => view.destroy()
  }, [editorDiv])

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div
        ref={editorDiv}
        className="bg-white text-xl rounded-lg select-none"
        style={{ fontFamily: 'Hack, monospace' }}
      />
    </div>
  )
}
