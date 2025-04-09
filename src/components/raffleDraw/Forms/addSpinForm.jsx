const AddSpinForm = ({
  prize,
  setPrize,
  sponsor,
  setSponsor,
  start_time,
  setStartTime,
}) => {
  return (
    <div className="p-6 border border-gray-300 rounded-lg shadow-lg max-w-md mx-auto bg-white">
      <div className="flex flex-col gap-4">
        {/* Prize Name Field */}
        <div className="flex flex-col">
          <label
            htmlFor="prize"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Prize Name
          </label>
          <input
            id="prize"
            name="prize"
            type="text"
            placeholder="Enter prize name"
            value={prize}
            onChange={(e) => setPrize(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          />
        </div>

        {/* Sponsor Field */}
        <div className="flex flex-col">
          <label
            htmlFor="sponsor"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Sponsor
          </label>
          <input
            id="sponsor"
            name="sponsor"
            type="text"
            placeholder="Enter sponsor name"
            value={sponsor}
            onChange={(e) => setSponsor(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          />
        </div>

        {/* Start Time Field */}
        <div className="flex flex-col">
          <label
            htmlFor="start_time"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Start Time
          </label>
          <input
            id="start_time"
            name="start_time"
            type="datetime-local"
            value={start_time}
            onChange={(e) => setStartTime(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default AddSpinForm;
