import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  // Define your prop types here
}

const App: React.FC<Props> = (props) => {
  return (
    <View>
      <Text>Welcome to my TypeScript app!</Text>
    </View>
  );
};

export default App;
