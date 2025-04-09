import { FaSearch, FaSyncAlt, FaPlus } from "react-icons/fa";

const ButtonSection = ({ handlerefresh, setShowAddForm, handleSearch }) => {
  return (
    // Buttons Section

    <div className="flex flex-wrap justify-center items-center mt-10 gap-4 mb-6">
      {/* Always Visible Buttons */}
      <button
        onClick={handleSearch}
        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <FaSearch className="h-5 w-5" /> Search
      </button>
      <button
        onClick={handlerefresh}
        className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
      >
        <FaSyncAlt className="h-5 w-5" /> Refresh
      </button>

      {/* Conditionally Visible "Add" Button */}
      {/* {true && (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <FaPlus className="h-5 w-5" /> Add
        </button>
      )} */}
    </div>
  );
};

export default ButtonSection;
