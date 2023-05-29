export default function CategoryPage() {
  return (
    <div className="block w-full overflow-scroll justify-center items-center p-8 text-black">
      <div className="flex w-full justify-between items-center mb-8">
        <div className="text-2xl font-bold">Category management</div>
        <div className="ml-auto">
          <button className="px-4 py-1 bg-blue-500 text-white rounded-md">Add new category</button>
        </div>
      </div>
      <div className="w-full bg-white shadow-md rounded-md p-6 mb-6">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-bold">Korean</div>
            <button className="px-4 py-2 bg-red-500 text-white rounded-md">Remove</button>
          </div>
          <div className="border-t-2 border-gray-300 mb-2"></div>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="pr-4">
                  <div className="flex">
                    <div className="py-2">Sub-category 1</div>
                    <div className="ml-auto flex items-center">
                      <button className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Remove</button>
                    </div>
                  </div>
                </td>
                <td className="pl-4">
                  <div className="flex">
                    <div className="py-2">Sub-category 1</div>
                    <div className="ml-auto flex items-center">
                      <button className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Remove</button>
                    </div>
                  </div>
                </td>
              </tr> 
              <tr>
                <td className="pr-4">
                  <div className="flex">
                    <div className="py-2">Sub-category 3</div>
                    <div className="ml-auto flex items-center">
                      <button className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Remove</button>
                    </div>
                  </div>
                </td>
                <td className="pl-4">
                  <div className="flex">
                    <div className="py-2">Sub-category 4</div>
                    <div className="ml-auto flex items-center">
                      <button className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Remove</button>
                    </div>
                  </div>
                </td>
              </tr>        
            </tbody>
          </table>
          <button className="mt-2 px-2 py-1 bg-blue-500 text-white rounded-md">Add new sub-category</button>
        </div>
      </div>

      <div className="w-full bg-white shadow-md rounded-md p-6 mb-6">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-bold">Japanese</div>
            <button className="px-4 py-2 bg-red-500 text-white rounded-md">Remove</button>
          </div>
          <div className="border-t-2 border-gray-300 mb-2"></div>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="pr-4">
                  <div className="flex">
                    <div className="py-2">Sub-category 1</div>
                    <div className="ml-auto flex items-center">
                      <button className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Remove</button>
                    </div>
                  </div>
                </td>
                <td className="pl-4">
                  <div className="flex">
                    <div className="py-2">Sub-category 1</div>
                    <div className="ml-auto flex items-center">
                      <button className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Remove</button>
                    </div>
                  </div>
                </td>
              </tr> 
              <tr>
                <td className="pr-4">
                  <div className="flex">
                    <div className="py-2">Sub-category 3</div>
                    <div className="ml-auto flex items-center">
                      <button className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Remove</button>
                    </div>
                  </div>
                </td>
                <td className="pl-4">
                  <div className="flex">
                    <div className="py-2">Sub-category 4</div>
                    <div className="ml-auto flex items-center">
                      <button className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Remove</button>
                    </div>
                  </div>
                </td>
              </tr>        
            </tbody>
          </table>
          <button className="mt-2 px-2 py-1 bg-blue-500 text-white rounded-md">Add new sub-category</button>
        </div>
      </div>

      <div className="w-full bg-white shadow-md rounded-md p-6 mb-6">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-bold">Western</div>
            <button className="px-4 py-2 bg-red-500 text-white rounded-md">Remove</button>
          </div>
          <div className="border-t-2 border-gray-300 mb-2"></div>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="pr-4">
                  <div className="flex">
                    <div className="py-2">Sub-category 1</div>
                    <div className="ml-auto flex items-center">
                      <button className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Remove</button>
                    </div>
                  </div>
                </td>
                <td className="pl-4">
                  <div className="flex">
                    <div className="py-2">Sub-category 1</div>
                    <div className="ml-auto flex items-center">
                      <button className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Remove</button>
                    </div>
                  </div>
                </td>
              </tr> 
              <tr>
                <td className="pr-4">
                  <div className="flex">
                    <div className="py-2">Sub-category 3</div>
                    <div className="ml-auto flex items-center">
                      <button className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Remove</button>
                    </div>
                  </div>
                </td>
                <td className="pl-4">
                  <div className="flex">
                    <div className="py-2">Sub-category 4</div>
                    <div className="ml-auto flex items-center">
                      <button className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Remove</button>
                    </div>
                  </div>
                </td>
              </tr>        
            </tbody>
          </table>
          <button className="mt-2 px-2 py-1 bg-blue-500 text-white rounded-md">Add new sub-category</button>
        </div>
      </div>
    </div>
  );
}