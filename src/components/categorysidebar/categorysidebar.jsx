export default function CategorySidebar({ categories, selectedCategory, onSelect }) {
  return (
    <aside className="w-64 bg-gray-100 p-4 border-r">
      <h3 className="text-lg font-semibold mb-4">Categories</h3>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category}>
            <button
              className={`w-full text-left p-2 rounded ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => onSelect(category)}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
