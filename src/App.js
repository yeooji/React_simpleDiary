import React, {useCallback, useEffect, useMemo, useReducer, useRef} from 'react';
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';

const reducer = (state, action) => {
  switch(action.type) {
    case 'INIT': {
      return action.data
    }
    case 'CREATE': {
      const create_date = new Date().getTime();
      const newItem = {
        ...action.data,
        create_date
      }
      return [newItem, ...state];
    }
    case 'REMOVE': {
      return state.filter((it) => it.id !== action.targetId);
    }
    case 'EDIT': {
      return state.map((it) => it.id === action.targetId ? {...it, content: action.newContent} : it);
    }
    default:
      return state;
  }
};

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
  const [data, dispatch] = useReducer(reducer,[]);

  const dateId = useRef(0);

  // API 호출 함수
  const getData = async() => {
    const res = await fetch('https://jsonplaceholder.typicode.com/comments').then((res) => res.json());
    
    // 일기데이터 기초값 설정
    const initData = res.slice(0,20).map((it) => {
      return {
        author : it.email,
        content : it.body,
        emotion : Math.floor(Math.random() * 5)+1,
        create_date : new Date().getTime(),
        id : dateId.current++
      }
    });

    dispatch({type:'INIT', data:initData});
  };

  // 마운트 후 바로 처리
  useEffect(() => {
    getData();
  },[]);
 
  const onCreate = useCallback((author, content, emotion) => {
    dispatch({type:'CREATE',data:{author, content, emotion, id:dateId.current}});

    dateId.current += 1;
  },[]
  );

  const onRemove = useCallback((targetId) => {
    dispatch({type:'REMOVE',targetId});
  },[]);

  const onEdit = useCallback((targetId, newContent) => {
    dispatch({type:'EDIT', targetId, newContent});
  },[]);

  const memoizedDispatches = useMemo(() => {
    return {onCreate, onRemove, onEdit}
  }, []); // 재생성되지 않게 빈배열로 전달

  const getDiaryAnalysis = useMemo(() => {
      const goodCount = data.filter((it) => it.emotion >= 3).length; // 좋음
      const badCount = data.length - goodCount; // 나쁨
      const goodRatio = (goodCount / data.length) * 100; // 좋음비율

      //3개의 데이터를 객체로 리턴
      return {goodCount,badCount,goodRatio};
    }, [data.length]
  );

  //객체로 반환되니까 똑같이 비구조화할당으로 받도록 처리
  const {goodCount,badCount,goodRatio} = getDiaryAnalysis;

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
        <div className="App">
          <DiaryEditor />
          <div>전체일기 : {data.length}</div>
          <div>기분 좋은 일기 개수 : {goodCount}</div>
          <div>기분 나쁜 일기 개수 : {badCount}</div>
          <div>기분 좋은 일기 비율 : {goodRatio}</div>
          <DiaryList />
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
};

export default App;
