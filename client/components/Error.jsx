const Error = ({ errors }) => {
  return (
    <div className="alert alert-danger">
      <ul className="mb-0">
        {errors.map((err, index) => (
          <li key={index}>{err.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Error;
