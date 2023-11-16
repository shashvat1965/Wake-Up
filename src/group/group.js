import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Heading} from 'tamagui';
import {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import AddSVGComponent from '../../assets/add';
import {FirebaseService} from '../services/firebase';
import {Colors} from '../services/colors';
import DatePicker from 'react-native-date-picker';
import {createScheduledNotification} from '../../index';
import {StorageService} from '../services/local_storage';

export const GroupScreen = ({navigation, route}) => {
  const groupId = route.params.id;
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const subscriber = firestore()
      .collection('groups')
      .onSnapshot(async querySnapshot => {
        const users = [];
        let id_list = [];
        querySnapshot.forEach(documentSnapshot => {
          const data = documentSnapshot.data();
          if (documentSnapshot.id === groupId) {
            id_list = data.members;
          }
        });
        for (let i = 0; i < id_list.length; i++) {
          const user = await FirebaseService.getUserFromId(id_list[i]);
          users.push({
            key: id_list[i],
            name: user.name,
          });
        }
        setUsers(users);
        setLoading(false);
        console.log(users, loading);
      });

    return () => subscriber();
  }, []);

  return (
    <View style={style.bg}>
      <DatePicker
        modal
        open={open}
        androidVariant={'iosClone'}
        date={date}
        onConfirm={async date => {
          setOpen(false);
          setDate(date);
          await FirebaseService.setGroupNotification(
            groupId,
            date.getTime(),
            StorageService.getLocal('name'),
          );
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <View style={style.listContainer}>
        {!loading ? (
          users.length > 0 ? (
            <FlatList
              style={style.list}
              keyExtractor={item => item.key}
              data={users}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => {}}>
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
            <Heading color="white">No members yet!</Heading>
          )
        ) : (
          <ActivityIndicator color="white"></ActivityIndicator>
        )}
      </View>
      <View style={style.fab}>
        <TouchableOpacity
          onPress={async () => {
            console.log('pressed');
            setOpen(true);
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
  fab: {
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
