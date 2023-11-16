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

export const JoinModal = ({visible, toggleModal}) => {
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
            style={style.title}
            onChangeText={name => {
              setName(name);
            }}>
            Enter the Name
          </TextInput>
          <TouchableOpacity
            onPress={async () => {
              toggleModal(false);
              const user_id = StorageService.getLocal('user_id');
              await FirebaseService.joinGroup(user_id, name).then(id => {
                console.log(id);
                navigateToGroup(id);
              });
            }}>
            <Text style={style.modalButton}>Join Group</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const style = StyleSheet.create({
  modalButton: {
    height: 50,
    width: 200,
    backgroundColor: Colors.tertiaryColor,
    borderRadius: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 35,
    color: Colors.primaryColor,
    borderColor: 'white',
    borderWidth: 2,
  },
  title: {
    color: Colors.primaryColor,
  },
  modal: {
    margin: 20,
    marginTop: 230,
    height: 200,
    backgroundColor: Colors.secondaryColor,
    color: Colors.primaryColor,
    borderRadius: 20,
    borderColor: Colors.primaryColor,
    borderWidth: 2,
    padding: 35,
    alignItems: 'center',
  },
});
