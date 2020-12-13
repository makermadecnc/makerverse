import ensureArray from 'ensure-array';

export default (word, group, object) => {
  const resText = {
    // Motion
    'G0':  'Rapid Move (G0)' ,
    'G1':  'Linear Move (G1)' ,
    'G2':  'CW Arc (G2)' ,
    'G3':  'CCW Arc (G3)' ,
    'G38.2':  'Probing (G38.2)' ,
    'G38.3':  'Probing (G38.3)' ,
    'G38.4':  'Probing (G38.4)' ,
    'G38.5':  'Probing (G38.5)' ,
    'G80':  'Cancel Mode (G80)' ,

    // Work Coordinate System
    'G54':  'P1 (G54)' ,
    'G55':  'P2 (G55)' ,
    'G56':  'P3 (G56)' ,
    'G57':  'P4 (G57)' ,
    'G58':  'P5 (G58)' ,
    'G59':  'P6 (G59)' ,

    // Plane
    'G17':  'XY Plane (G17)' ,
    'G18':  'XZ Plane (G18)' ,
    'G19':  'YZ Plane (G19)' ,

    // Units
    'G20':  'Inches (G20)' ,
    'G21':  'Millimeters (G21)' ,

    // Path
    'G61':  'Exact Path (G61)' ,
    'G61.1':  'Exact Stop (G61.1)' ,
    'G64':  'Continuous (G64)' ,

    // Distance
    'G90':  'Absolute (G90)' ,
    'G91':  'Relative (G91)' ,

    // Feed Rate
    'G93':  'Inverse Time (G93)' ,
    'G94':  'Units/Min (G94)' ,

    // Tool Length Offset
    'G43.1':  'Active Tool Offset (G43.1)' ,
    'G49':  'No Tool Offset (G49)' ,

    // Program
    'M0':  'Program Stop (M0)' ,
    'M1':  'Optional Program Stop (M1)' ,
    'M2':  'Program End (M2)' ,
    'M30':  'Program End and Rewind (M30)' ,

    // Spindle
    'M3':  'Spindle On, CW (M3)' ,
    'M4':  'Spindle On, CCW (M4)' ,
    'M5':  'Spindle Off (M5)' ,

    // Coolant
    'M7':  'Mist Coolant On (M7)' ,
    'M8':  'Flood Coolant On (M8)' ,
    'M9':  'Coolant Off (M9)' ,
  };

  const words = ensureArray(word).map((word) => resText[word] || word);

  return words.length > 1 ? words : words[0];
};
