import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import AddSVGComponent from '../../assets/add';
import {FirebaseService} from '../services/firebase';
import {Colors} from '../services/colors';
import DatePicker from 'react-native-date-picker';
import {StorageService} from '../services/local_storage';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../services/metrics';

export const GroupScreen = ({route}) => {
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
            <Text style={style.title} color="white">
              No members yet!
            </Text>
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
    width: horizontalScale(70),
    height: verticalScale(70),
    borderRadius: moderateScale(35),
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: verticalScale(30),
    right: horizontalScale(30),
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
    marginTop: verticalScale(20),
  },
  item: {
    backgroundColor: Colors.secondaryColor,
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(20),
    marginTop: verticalScale(20),
    marginHorizontal: horizontalScale(20),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: Colors.tertiaryColor,
  },
  title: {
    fontSize: moderateScale(32),
    color: Colors.primaryColor,
  },
});
