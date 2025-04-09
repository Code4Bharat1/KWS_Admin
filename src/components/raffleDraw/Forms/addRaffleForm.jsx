const AddRaffleForm = ({
  handleCancelAdd,
  handleAddRaffle,
  newRaffle,
  setNewRaffle,
}) => {
  return (
    <div className="mb-6 p-4 border border-gray-300 rounded-lg max-w-sm mx-auto">
      <h2 className="text-lg font-bold mb-4">Add New Raffle Draw</h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label
            htmlFor="newEventName"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Event Name
          </label>
          <input
            id="newEventName"
            name="name"
            type="text"
            placeholder="Event Name"
            value={newRaffle.name}
            onChange={(e) =>
              setNewRaffle({ ...newRaffle, name: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="newStartTime"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Start Time
          </label>
          <input
            id="newStartTime"
            name="start_time"
            type="datetime-local"
            value={newRaffle.start_time}
            onChange={(e) =>
              setNewRaffle({ ...newRaffle, start_time: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="newEndTime"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            End Time
          </label>
          <input
            id="newEndTime"
            name="end_time"
            type="datetime-local"
            value={newRaffle.end_time}
            onChange={(e) =>
              setNewRaffle({ ...newRaffle, end_time: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleAddRaffle}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add Raffle Draw
          </button>
          <button
            onClick={handleCancelAdd}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRaffleForm;
