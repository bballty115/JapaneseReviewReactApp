import lesson_1_vocab from './lessons/1/lesson_1_vocab';
import lesson_1_greetings from './lessons/1/lesson_1_greetings';
import lesson_1_numbers from './lessons/1/lesson_1_numbers';
import lesson_2_vocab from './lessons/2/lesson_2_vocab';
import lesson_2_bonus from './lessons/2/lesson_2_bonus';
import lesson_3_vocab from './lessons/3/lesson_3_vocab';
import lesson_4_vocab from './lessons/4/lesson_4_vocab';
import kanji_one_to_rest from './kanji/n5/base/kanji_one_to_rest';
import kanji_eye_to_small from './kanji/n5/base/kanji_eye_to_small';
import kanji_big_to_left from './kanji/n5/base/kanji_big_to_left';
import kanji_stand_to_tall from './kanji/n5/base/kanji_stand_to_tall';
import kanji_what_to_long from './kanji/n5/base/kanji_what_to_long';
import n5_vocab_easy from './kanji/n5/vocab/easy';
import n5_vocab_medium from './kanji/n5/vocab/medium';
import n5_vocab_hard from './kanji/n5/vocab/hard';
import lesson_5_vocab from './lessons/5/lesson_5_vocab';
import kanji_capital_to_comment from './kanji/n4/base/kanji_capital_to_comment';

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
        sectionDisplayName: 'Lesson 5',
        sectionId: 'lesson_5',
        dataSets: [
            {
                displayName: 'Vocab',
                dataSetId: 'vocab',
                data: lesson_5_vocab,
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
            {
                displayName: '"Big" to "Left" [31]',
                dataSetId: 'n5_big_to_left',
                data: kanji_big_to_left,
            },
            {
                displayName: '"Stand" to "Tall" [16]',
                dataSetId: 'n5_stand_to_tall',
                data: kanji_stand_to_tall,
            },
            {
                displayName: '"What" to "Long" [17]',
                dataSetId: 'n5_what_to_long',
                data: kanji_what_to_long,
            },
        ],
    },
    {
        sectionDisplayName: 'N5 Kanji Vocab',
        sectionId: 'kanji_vocab_n5',
        dataSets: [
            {
                displayName: 'Vocab Easy [74]',
                dataSetId: 'n5_vocab_easy',
                data: n5_vocab_easy,
            },
            {
                displayName: 'Vocab Medium [36]',
                dataSetId: 'n5_vocab_medium',
                data: n5_vocab_medium,
            },
            {
                displayName: 'Vocab Hard [23]',
                dataSetId: 'n5_vocab_hard',
                data: n5_vocab_hard,
            },
        ],
    },
    {
        sectionDisplayName: 'N4 Kanji',
        sectionId: 'kanji_n4',
        dataSets: [
            {
                displayName: '"Capital" to "Comment" [10]',
                dataSetId: 'n5_capital_to_comment',
                data: kanji_capital_to_comment,
            },
        ],
    },
];

export default dataGroups;
