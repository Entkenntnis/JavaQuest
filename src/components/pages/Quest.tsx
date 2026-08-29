import { CodeSnippet } from '../helper/CodeSnippet'

export function Quest() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-pink-500 flex min-h-0">
        <div className="flex-1 bg-yellow-500 min-w-0">
          <CodeSnippet />
        </div>
        <div className="shrink-0 w-[200px]">Support Area</div>
      </div>
      <div className="shrink-0 h-[200px] bg-emerald-300"></div>
    </div>
  )
}
