"use client";
const Error = ({
  error,
  reset,
}: Readonly<{ error: Error; reset: () => void }>) => {
  return (
    <div>
      <div>Error: {error.message}</div>
      <button
        onClick={reset}
        className="p-2 m-2 bg-red-800 rounded text-white
      "
      >
        Reset
      </button>
    </div>
  );
};

export default Error;
