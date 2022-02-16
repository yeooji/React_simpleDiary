import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';

const dummyList = [
  {
    id: 1,
    author: "더미1",
    content: "내용11111",
    emotion: 2,
    create_date: new Date().getTime()
  },
  {
    id: 2,
    author: "더미2",
    content: "내용222221",
    emotion: 1,
    create_date: new Date().getTime()
  },
  {
    id: 3,
    author: "더미3",
    content: "333311111",
    emotion: 3,
    create_date: new Date().getTime()
  }
];

function App() {
  return (
    <div className="App">
      <DiaryEditor/>
      <DiaryList diaryList={dummyList} />
    </div>
  );
};

export default App;
