import lesson_1_vocab from './lessons/1/lesson_1_vocab';
import lesson_1_greetings from './lessons/1/lesson_1_greetings';
import lesson_1_numbers from './lessons/1/lesson_1_numbers';
import lesson_2_vocab from './lessons/2/lesson_2_vocab';
import lesson_2_bonus from './lessons/2/lesson_2_bonus';
import lesson_3_vocab from './lessons/3/lesson_3_vocab';
import lesson_4_vocab from './lessons/4/lesson_4_vocab';
import kanji_one_to_rest from './kanji/n5/kanji_one_to_rest';
import kanji_eye_to_small from './kanji/n5/kanji_eye_to_small';

const dataGroups = [
    {
        sectionDisplayName: 'Lesson 1',
        sectionId: 'lesson_1',
        dataSets: [
            {
                displayName: 'Vocab',
                dataSetId: 'vocab',
                data: lesson_1_vocab,
            },
            {
                displayName: 'Greetings',
                dataSetId: 'greetings',
                data: lesson_1_greetings,
            },
            {
                displayName: 'Numbers (0-100)',
                dataSetId: 'numbers',
                data: lesson_1_numbers,
            },
        ],
    },
    {
        sectionDisplayName: 'Lesson 2',
        sectionId: 'lesson_2',
        dataSets: [
            {
                displayName: 'Vocab',
                dataSetId: 'vocab',
                data: lesson_2_vocab,
            },

            {
                displayName: 'Bonus',
                dataSetId: 'bonus',
                data: lesson_2_bonus,
            },
        ],
    },
    {
        sectionDisplayName: 'Lesson 3',
        sectionId: 'lesson_3',
        dataSets: [
            {
                displayName: 'Vocab',
                dataSetId: 'vocab',
                data: lesson_3_vocab,
            },
        ],
    },
    {
        sectionDisplayName: 'Lesson 4',
        sectionId: 'lesson_4',
        dataSets: [
            {
                displayName: 'Vocab',
                dataSetId: 'vocab',
                data: lesson_4_vocab,
            },
        ],
    },
    {
        sectionDisplayName: 'N5 Kanji',
        sectionId: 'kanji_n5',
        dataSets: [
            {
                displayName: '"One" to "Rest" [30]',
                dataSetId: 'n5_one_to_rest',
                data: kanji_one_to_rest,
            },
            {
                displayName: '"Eye" to "Small" [25]',
                dataSetId: 'n5_eye_to_small',
                data: kanji_eye_to_small,
            },
        ],
    },
];

export default dataGroups;
