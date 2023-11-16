import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {StorageService} from '../services/local_storage';
import {FirebaseService} from '../services/firebase';
import {useState} from 'react';
import {navigateWithRef} from '../services/navigation';
import {Colors} from '../services/colors';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../services/metrics';

export const CreateModal = ({visible, toggleModal}) => {
  const [name, setName] = useState('');

  const navigateToGroup = id => {
    navigateWithRef('Group', {id: id});
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        console.log('modal closed');
        toggleModal(false);
      }}>
      <View>
        <View style={style.modal}>
          <TextInput
            numberOfLines={1}
            placeholder={'Enter the Name'}
            placeholderTextColor={'grey'}
            style={style.title}
            onChangeText={name => {
              setName(name);
            }}></TextInput>
          <TouchableOpacity
            onPress={async () => {
              toggleModal(false);
              const user_id = StorageService.getLocal('user_id');
              await FirebaseService.createGroup(user_id, name).then(id => {
                console.log(id);
                navigateToGroup(id);
              });
            }}>
            <Text style={style.modalButton}>Create Group</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const style = StyleSheet.create({
  modalButton: {
    height: verticalScale(60),
    width: horizontalScale(200),
    backgroundColor: Colors.tertiaryColor,
    borderRadius: moderateScale(20),
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: verticalScale(30),
    color: Colors.primaryColor,
    borderColor: 'white',
    borderWidth: 2,
  },
  title: {
    fontSize: moderateScale(20),
    marginTop: verticalScale(20),
    color: Colors.primaryColor,
  },
  modal: {
    marginHorizontal: horizontalScale(20),
    marginBottom: verticalScale(20),
    marginTop: verticalScale(250),
    height: verticalScale(220),
    backgroundColor: Colors.secondaryColor,
    color: Colors.primaryColor,
    borderRadius: moderateScale(20),
    borderColor: Colors.primaryColor,
    borderWidth: 2,
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(20),
    alignItems: 'center',
  },
});
