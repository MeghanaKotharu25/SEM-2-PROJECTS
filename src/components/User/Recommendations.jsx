import React from 'react';

function Recommendations({ recommendations, onOrder }) {
  if (!recommendations || !recommendations.recommendedItems) {
    return <div className="text-center mt-4 text-gray-500">No recommendations available</div>;
  }

  const { recommendedItems, explanation } = recommendations;

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 w-full mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Recommended Meals</h3>

      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
        <h4 className="text-md font-medium text-yellow-800">💡 AI Reasoning</h4>
        <p className="text-sm text-gray-700 mt-1">{explanation}</p>
      </div>

      {recommendedItems.length === 0 ? (
        <p className="text-center text-red-500">
          No meals found matching your criteria. Try adjusting your budget or preferences.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedItems.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-xl shadow-sm p-4 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h4>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span className="font-medium">₹{item.price}</span>
                <span>{item.macros}</span>
                {item.calories && <span>{item.calories} cal</span>}
              </div>
              {item.description && <p className="text-sm text-gray-500 mb-3">{item.description}</p>}
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-white w-full py-2 rounded-md font-medium transition duration-200"
                onClick={() => onOrder(item)}
              >
                Order Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Recommendations;
