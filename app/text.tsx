import { Text } from 'react-native';

function AppText(props: any) {
  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: 'Poppins',
          fontSize: 16,
          color: '#000',
        },
        props.style,
      ]}
    >
      {props.children}
    </Text>
    );
}


export default AppText;