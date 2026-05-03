import React from 'react';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '12px',
  },
  block: {
    width: '30px',
    height: '30px',
    borderRadius: '10px',
  },
};

/**
 * ColorBlocks component displays two colored blocks with labels.
 *
 * @memberof Dashboard.Dashboard_components
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.labelOne - The label for the first color block.
 * @param {string} props.colorOne - The background color of the first color block.
 * @param {string} props.labelTwo - The label for the second color block.
 * @param {string} props.colorTwo - The background color of the second color block.
 * @returns {JSX.Element} The rendered ColorBlocks component.
 */
const ColorBlocks = ({ labelOne, colorOne, labelTwo, colorTwo }) => {
  return (
    <div style={styles.container}>
      <div style={{ ...styles.block, backgroundColor: colorOne }} />
      <span>{labelOne}</span>
      <div style={{ ...styles.block, backgroundColor: colorTwo }} />
      <span>{labelTwo}</span>
    </div>
  );
};

export default ColorBlocks;
