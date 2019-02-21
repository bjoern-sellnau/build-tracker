import { formatBytes } from '@build-tracker/formatting';
import React from 'react';
import { DeltaCell as Cell } from '@build-tracker/comparator';
import { Td } from './Table';
import { StyleProp, Text, ViewStyle } from 'react-native';

interface Props {
  cell: Cell;
  sizeKey: string;
  style?: StyleProp<ViewStyle>;
}

const DeltaCell = (props: Props): React.ReactElement => {
  const { cell, sizeKey, style } = props;
  const value = cell.sizes[sizeKey];
  return (
    <Td style={style}>
      <Text>{value === 0 ? '' : formatBytes(value)}</Text>
    </Td>
  );
};

export default DeltaCell;
