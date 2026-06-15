export const SAMPLE_QUIZ_JSON = JSON.stringify({
  name: '示例英语题库',
  questions: [
    {
      type: 'single-choice',
      question: 'What is the capital of the United Kingdom?',
      options: ['Manchester', 'London', 'Liverpool', 'Birmingham'],
      answer: 1,
    },
    {
      type: 'single-choice',
      question: 'Which word means "愉快的" in English?',
      options: ['Sad', 'Angry', 'Happy', 'Tired'],
      answer: 2,
    },
    {
      type: 'single-choice',
      question: '"She ___ to school every day." Choose the correct form.',
      options: ['go', 'goes', 'going', 'gone'],
      answer: 1,
    },
    {
      type: 'single-choice',
      question: 'What is the plural form of "child"?',
      options: ['Childs', 'Childes', 'Children', 'Childrens'],
      answer: 2,
    },
    {
      type: 'single-choice',
      question: 'Which sentence is grammatically correct?',
      options: [
        'He don\'t like apples.',
        'He doesn\'t like apples.',
        'He not like apples.',
        'He doesn\'t likes apples.',
      ],
      answer: 1,
    },
    {
      type: 'matching',
      question: '请将左侧英文单词与右侧中文释义匹配',
      left: ['apple', 'banana', 'cherry', 'grape'],
      right: ['樱桃', '香蕉', '苹果', '葡萄'],
      pairs: [[0, 2], [1, 1], [2, 0], [3, 3]],
    },
    {
      type: 'matching',
      question: '请将左侧动词与右侧过去式匹配',
      left: ['eat', 'go', 'see', 'take'],
      right: ['went', 'saw', 'ate', 'took'],
      pairs: [[0, 2], [1, 0], [2, 1], [3, 3]],
    },
    {
      type: 'sentence-order',
      question: '我喜欢在周末读书',
      words: ['I', 'like', 'reading', 'books', 'on', 'weekends'],
      answer: [0, 1, 2, 3, 4, 5],
    },
    {
      type: 'sentence-order',
      question: '她每天早晨喝一杯咖啡',
      words: ['She', 'drinks', 'a', 'cup', 'of', 'coffee', 'every', 'morning'],
      answer: [0, 1, 2, 3, 4, 5, 6, 7],
    },
    {
      type: 'sentence-order',
      question: '他们正在公园里踢足球',
      words: ['They', 'are', 'playing', 'football', 'in', 'the', 'park'],
      answer: [0, 1, 2, 3, 4, 5, 6],
    },
  ],
}, null, 2);