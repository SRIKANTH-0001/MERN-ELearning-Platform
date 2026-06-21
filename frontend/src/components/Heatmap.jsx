import React from "react";

const Heatmap = ({ data }) => {
  return (
    <div>
      <h4>Engagement Heatmap</h4>
      {data.map((item, index) => (
        <div key={index} style={styles.row}>
          <span>{item.courseId}</span>
          <span>{item.completion}%</span>
          <span>{item.status}</span>
        </div>
      ))}
    </div>
  );
};

const styles = {
  row: {
    display: "flex",
    justifyContent: "space-between",
    background: "#f1f5f9",
    padding: "8px",
    marginBottom: "6px",
    borderRadius: "4px",
  },
};

export default Heatmap;
