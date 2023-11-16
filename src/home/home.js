import {
  ActivityIndicator,
  FlatList,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {StorageService} from '../services/local_storage';
import AddSVGComponent from '../../assets/add';
import {CreateModal} from './create_modal';
import {JoinModal} from './join_modal';
import {Colors} from '../services/colors';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../services/metrics';

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
            <Text color="white">No groups yet!</Text>
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
  joinFab: {
    width: horizontalScale(70),
    height: verticalScale(70),
    borderRadius: moderateScale(35),
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: verticalScale(30),
    left: horizontalScale(30),
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
    marginHorizontal: horizontalScale(16),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: Colors.tertiaryColor,
  },
  title: {
    fontSize: moderateScale(32),
    color: Colors.primaryColor,
  },
});
