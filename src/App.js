import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';

function App() {
  const [data, setData] = useState([]); 

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

    setData(initData);
  };

  // 마운트 후 바로 처리
  useEffect(() => {
    getData();
  },[]);
 
  const onCreate = useCallback((author, content, emotion) => {
    const create_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      create_date,
      id : dateId.current
    };
    dateId.current += 1;
    setData((data) => [newItem, ...data]); // TODO 최적화3 - 디펜던시 어레이 대신
  },[]
  );

  const onRemove = (targetId) => {
    const newDiaryList = data.filter((it) => it.id !== targetId);
    setData(newDiaryList);
  };

  const onEdit = (targetId, newContent) => {
    setData(
      data.map((it) => it.id === targetId ? {...it, content: newContent} : it)
    );
  };

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
    <div className="App">
      <DiaryEditor onCreate={onCreate} />
      <div>전체일기 : {data.length}</div>
      <div>기분 좋은 일기 개수 : {goodCount}</div>
      <div>기분 나쁜 일기 개수 : {badCount}</div>
      <div>기분 좋은 일기 비율 : {goodRatio}</div>
      <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList={data} />
    </div>
  );
};

export default App;
