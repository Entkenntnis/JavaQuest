export function InputBar() {
  return (
    <div className="">
      <div className="flex items-center bg-indigo-50 py-6">
        <div className="m-3 shrink-0 text-lg pb-1">
          <span className="px-6 bg-gray-300 italic border-2 border-pink-300 rounded font-mono">
            ???
          </span>
          <span className="ml-3">←</span>
        </div>
        <div className="flex-1 mt-3 pr-3 mb-3">
          <input className="w-full h-[50px] text-xl text-center p-3 font-mono border-violet-500 border-2 outline-none bg-violet-50 focus:bg-white"></input>
        </div>
      </div>
      <div className="text-lg px-3 py-2.5 bg-indigo-200 flex justify-between items-center gap-4">
        <div className="">
          Vervollständige die Lücke mit einem passenden booleschen Ausdruck.
        </div>
        <button className="text-xl bg-indigo-500 hover:bg-indigo-700 px-4 py-0.5 rounded-lg text-white transition-colors">
          Prüfen
        </button>
      </div>
    </div>
  )
}
