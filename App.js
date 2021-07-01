import React, {useState, useEffect} from 'react';
import {
  Image,
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import Images from './assets/image/imagePath';
import {PersistGate} from 'redux-persist/integration/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Redux
import {useDispatch, useSelector, Provider} from 'react-redux';
import {createStore} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import rootReducer from './reducer/Reducer';
import hardSet from 'redux-persist/es/stateReconciler/hardSet';
import {addItem, deleteItem, updateItem} from './reducer/Action';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: hardSet,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer);
const persistedStore = persistStore(store);

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistedStore} loading={null}>
        <Basic />
      </PersistGate>
    </Provider>
  );
}

function Basic() {
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);
  const [currentItem, setCurrentItem] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setModal] = useState(false);
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [length, setLength] = useState('');
  const [weight, setWeight] = useState('');
  const [description, setDescription] = useState('');
  const [, forceUpdate] = useState();

  const dispatch = useDispatch();
  const dataReducer = useSelector(state => state.dataReducer);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
    }, 4000);
  }, []);

  function verify() {
    if (name == '') {
      alert('Please enter a name');
      return false;
    } else if (breed == '') {
      alert('Please enter a breed');
      return false;
    } else if (length == '') {
      alert('Please enter a length');
      return false;
    } else if (weight == '') {
      alert('Please enter a weight');
      return false;
    } else if (description == '') {
      alert('Please enter a description');
      return false;
    } else {
      addItemMethod();
    }
  }

  function addItemMethod() {
    var temp;
    if (dataReducer != undefined && currentItem) {
      temp = dataReducer.list;
    } else {
      temp = [];
    }
    var obj = {};
    obj.name = name;
    obj.breed = breed;
    obj.length = length;
    obj.weight = weight;
    obj.description = description;
    if (currentItem) {
      temp[currentIndex] = obj;
      dispatch(updateItem(obj, currentIndex));
    } else {
      temp.push(obj);
      dispatch(addItem(obj));
    }
    setList(temp);
    forceUpdate(Math.random());
    setModalView('', 0);
  }

  function editItem(item, index) {
    setCurrentIndex(index);
    setCurrentItem(item);
    setModalView(item, index);
  }

  function deleteItemMethod(index) {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {
          text: 'Yes',
          onPress: () => {
            var temp = dataReducer.list;
            temp.splice(index, 1);
            setList(temp);
            setModalView('', 0);
            forceUpdate(Math.random());
            dispatch(deleteItem(index));
          },
        },
      ],
      {cancelable: true},
    );
  }

  function setModalView(v, index) {
    if (v) {
      setName(v.name);
      setBreed(v.breed);
      setLength(v.length);
      setWeight(v.weight);
      setDescription(v.description);
      setTimeout(() => {
        setModal(true);
      }, 200);
    } else {
      setCurrentIndex(0);
      setCurrentItem('');
      setName('');
      setBreed('');
      setLength('');
      setWeight('');
      setDescription('');
      setModal(false);
    }
  }

  function listItem(item, index) {
    return (
      <View
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: 8,
          marginBottom: 10,
          padding: 10,
          backgroundColor: '#87CEEB',
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          {imageButton(Images.edit, () => editItem(item, index), [
            {height: 15, marginBottom: 5, marginRight: 15},
          ])}
          {imageButton(
            Images.delete,
            () => {
              deleteItemMethod(index);
            },
            [{height: 15, marginBottom: 5}],
          )}
        </View>
        {textItem('Name', item.name)}
        {textItem('Breed', item.breed)}
        <View style={{flexDirection: 'row'}}>
          {textItem('Length', item.length + ' Inch', [
            {flex: 1, marginRight: 10},
          ])}
          {textItem('Weight', item.weight + ' KG', [{flex: 1}])}
        </View>
        {textItem('Description', item.description, [], 2)}
      </View>
    );
  }

  function textItem(title, value, style, numberOfLines = 1) {
    return (
      <Text
        numberOfLines={numberOfLines}
        style={[
          {
            color: '#000',
            fontWeight: 'bold',
            textTransform: 'capitalize',
          },
          style,
        ]}>
        {title + ':- '}
        <Text numberOfLines={1} style={{color: '#000', fontWeight: '300'}}>
          {value}
        </Text>
      </Text>
    );
  }

  function imageButton(img, onPress, style) {
    return (
      <TouchableOpacity activeOpacity={1} style={[style]} onPress={onPress}>
        <Image source={img} style={{height: '100%', aspectRatio: 1 / 1}} />
      </TouchableOpacity>
    );
  }

  function textInput(
    placeholder,
    value,
    onChange,
    maxLength,
    style,
    keyboardType,
  ) {
    return (
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        maxLength={maxLength}
        style={[
          {
            borderBottomColor: '#000',
            borderBottomWidth: 1,
            marginBottom: 10,
          },
          style,
        ]}
      />
    );
  }

  function getOnlyNumber(value) {
    return value.replace(/[-+ #*;,.<>\{\}\[\]\\\/]/gi, '');
  }

  function modal() {
    return (
      <Modal
        animationType={'none'}
        visible={showModal}
        onRequestClose={() => setModal(false)}
        transparent={true}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalView('', 0)}
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'space-around',
            backgroundColor: '#00000099',
          }}>
          <View
            onStartShouldSetResponder={() => true}
            style={{
              alignSelf: 'center',
              width: '80%',
              backgroundColor: '#fff',
              justifyContent: 'center',
              maxHeight: 400,
              zIndex: 1000,
              borderRadius: 10,
              padding: 10,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#000',
                textAlign: 'center',
                marginBottom: 10,
              }}>
              {currentItem ? 'Edit Cat' : 'Add Cat'}
            </Text>
            {textInput('Name', name, v => setName(v), 30)}
            {textInput('Breed', breed, v => setBreed(v), 30)}
            <View style={{flexDirection: 'row'}}>
              {textInput(
                'Length (in Inch)',
                length,
                v => setLength(getOnlyNumber(v)),
                3,
                [{flex: 1, marginRight: 10}],
                'number-pad',
              )}
              {textInput(
                'Weight (in KG)',
                weight,
                v => setWeight(getOnlyNumber(v)),
                3,
                [{flex: 1}],
                'number-pad',
              )}
            </View>
            {textInput('Description', description, v => setDescription(v), 100)}
            {imageButton(currentItem ? Images.edit : Images.add, verify, [
              {height: 30, marginVertical: '5%', alignSelf: 'center'},
            ])}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  return (
    <ImageBackground
      source={Images.splash}
      style={{
        flex: 1,
        height: '100%',
        alignItems: 'center',
        opacity: isLoading ? 0.7 : 1,
      }}>
      {isLoading && (
        <View style={{flex: 1, width: '90%', alignItems: 'center'}}>
          {imageButton(Images.add, () => setModal(true), [
            {height: '5%', marginVertical: '5%'},
          ])}
          {dataReducer != undefined &&
          dataReducer.list &&
          dataReducer.list.length ? (
            <FlatList
              data={dataReducer.list}
              extraData={dataReducer.list}
              showsVerticalScrollIndicator={false}
              style={[{flex: 1, width: '100%'}]}
              renderItem={({item, index}) => listItem(item, index)}
              keyExtractor={(item, index) => item + index}
            />
          ) : (
            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#000'}}>
              Please add some Cat
            </Text>
          )}
        </View>
      )}
      {modal()}
    </ImageBackground>
  );
}
