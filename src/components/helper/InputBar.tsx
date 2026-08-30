export function InputBar() {
  return (
    <div className="">
      <div className="text-lg p-3 bg-indigo-200 flex justify-between items-center gap-4">
        <div className="italic">
          Vervollständige das Programm mit einem passenden booleschen Ausdruck:
        </div>
        <button className="text-xl bg-indigo-500 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white transition-colors">
          Prüfen
        </button>
      </div>
      <div className="flex items-start h-[130px] bg-indigo-50">
        <div className="m-3 shrink-0">
          <span className="px-8 bg-gray-600 text-gray-200 italic">???</span>
          <span className="text-xl ml-3">=</span>
        </div>
        <div className="flex-1 mt-3 pr-3">
          <textarea
            className="w-full h-[100px] text-xl text-center"
            style={{ fontFamily: 'Hack, monospace' }}
          ></textarea>
        </div>
      </div>
    </div>
  )
}
