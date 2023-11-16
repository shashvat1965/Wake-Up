import {
  ActivityIndicator,
  FlatList,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {Heading} from 'tamagui';
import {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {StorageService} from '../services/local_storage';
import AddSVGComponent from '../../assets/add';
import {FirebaseService} from '../services/firebase';
import {Timestamp} from '@react-native-firebase/firestore/lib/modular/Timestamp';
import {CreateModal} from './create_modal';
import {JoinModal} from './join_modal';
import {Colors} from '../services/colors';

export const HomeScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);

  useEffect(() => {
    const subscriber = firestore()
      .collection('groups')
      .onSnapshot(querySnapshot => {
        const user_id = StorageService.getLocal('user_id');
        const group = [];

        querySnapshot.forEach(documentSnapshot => {
          const data = documentSnapshot.data();
          if (data.members.includes(user_id)) {
            group.push({
              key: documentSnapshot.id,
              name: data.name,
            });
          }
        });
        setGroups(group);
        setLoading(false);
      });

    return () => subscriber();
  }, []);

  const navigateToGroup = id => {
    navigation.navigate('Group', {id: id});
  };

  return (
    <View style={style.bg}>
      <CreateModal
        visible={createModalVisible}
        toggleModal={prop => {
          setCreateModalVisible(prop);
        }}
      />
      <JoinModal
        visible={joinModalVisible}
        toggleModal={prop => {
          setJoinModalVisible(prop);
        }}
      />
      <View style={style.listContainer}>
        {!loading ? (
          groups.length > 0 ? (
            <FlatList
              style={style.list}
              keyExtractor={item => item.key}
              data={groups}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => navigateToGroup(item.key)}>
                  <View style={style.item}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode={'tail'}
                      style={style.title}>
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}></FlatList>
          ) : (
            <Heading color="white">No groups yet!</Heading>
          )
        ) : (
          <ActivityIndicator color="white"></ActivityIndicator>
        )}
      </View>
      <View style={style.createFab}>
        <TouchableOpacity
          onPress={() => {
            console.log('pressed');
            setCreateModalVisible(true);
          }}>
          <AddSVGComponent />
        </TouchableOpacity>
      </View>
      <View style={style.joinFab}>
        <TouchableOpacity
          onPress={() => {
            console.log('pressed');
            setJoinModalVisible(true);
          }}>
          <AddSVGComponent />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  bg: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgColor,
  },
  createFab: {
    width: 70,
    height: 70,
    borderRadius: 35,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 30,
    right: 30,
    backgroundColor: Colors.tertiaryColor,
    elevation: 5,
    shadowColor: '#000',
  },
  joinFab: {
    width: 70,
    height: 70,
    borderRadius: 35,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 30,
    left: 30,
    backgroundColor: Colors.tertiaryColor,
    elevation: 5,
    shadowColor: '#000',
  },
  listContainer: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: '80%',
    backgroundColor: Colors.bgColor,
    marginTop: 20,
  },
  item: {
    backgroundColor: Colors.secondaryColor,
    padding: 20,
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.tertiaryColor,
  },
  title: {
    fontSize: 32,
    color: Colors.primaryColor,
  },
});
