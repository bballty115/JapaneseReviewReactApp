import './App.css';
import { useState, useEffect } from 'react';
import dataGroups from '../data/data_groups';

/**
 * Array shuffle function, stolen from the internet
 * Source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
function shuffleArray(array: any[]) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
}

/**
 * Annoying but I can't use ts enums so this will do
 */
const ExerciseStatus = {
    NoneSelected: 0,
    Running: 1,
    Finished: 2,
};
type ExerciseStatus = (typeof ExerciseStatus)[keyof typeof ExerciseStatus];

const ExerciseType = {
    None: 0,
    InfiniteMode: 1,
    BagMode: 2,
};
type ExerciseType = (typeof ExerciseType)[keyof typeof ExerciseType];

const PopupContainer = {
    None: 0,
    ExerciseOptions: 1,
    AppSettings: 2,
};
type PopupContainer = (typeof PopupContainer)[keyof typeof PopupContainer];

type DataGroupId = {
    sectionId: string;
    dataSetId: string;
};

type PrevSelectionInfo = {
    selected_index: number;
    correct_index: number;
};
const EMPTY_PREV_SELECT: PrevSelectionInfo = {
    selected_index: -1,
    correct_index: -1,
};

type AppSettings = {
    bagModeCount: number;
    vocabSideStart: string;
    selectableOptions: number;
    hideButtonTextUntilClickOrHover: boolean;
};
const DEFAULT_APP_SETTINGS = {
    bagModeCount: 2,
    vocabSideStart: 'en',
    selectableOptions: 4,
    hideButtonTextUntilClickOrHover: false,
};

// Store / retrieve app settings in local storage
function getAppSettings() {
    let strData = localStorage.getItem('appSettings');
    if (strData === null) return DEFAULT_APP_SETTINGS;
    return JSON.parse(strData);
}
function storeAppSettings(appSettings: AppSettings) {
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
}
// Store / retrieve selected lessons in local storage
function getExerciseDatasetInfo() {
    let strData = localStorage.getItem('exerciseDatasetInfo');
    if (strData === null) return [];
    return JSON.parse(strData);
}
function storeExerciseDatasetInfo(exerciseDatasetInfo: DataGroupId[]) {
    localStorage.setItem(
        'exerciseDatasetInfo',
        JSON.stringify(exerciseDatasetInfo),
    );
}
// Store / retrieve exercise state
function getExerciseStatus() {
    let strData = localStorage.getItem('exerciseStatus');
    if (strData === null) return ExerciseStatus.NoneSelected;
    let result = JSON.parse(strData);
    // If run was interrupted, just assume finished to allow restarting / editing easily
    // I am lazy :P
    if (result == ExerciseStatus.Running) {
        return ExerciseStatus.Finished;
    } else return result;
}
function storeExerciseStatus(exerciseStatus: ExerciseStatus) {
    localStorage.setItem('exerciseStatus', JSON.stringify(exerciseStatus));
}
// Store / retrieve  exercise type
function getExerciseType() {
    let strData = localStorage.getItem('exerciseType');
    if (strData === null) return ExerciseType.None;
    return JSON.parse(strData);
}
function storeExerciseType(exerciseType: ExerciseType) {
    localStorage.setItem('exerciseType', JSON.stringify(exerciseType));
}

function App() {
    // App settings
    const [appSettings, setAppSettings] =
        useState<AppSettings>(getAppSettings());
    // Store app settings when updated
    useEffect(() => {
        storeAppSettings(appSettings);
    }, [appSettings]);
    // Exercise status
    // - Is the exercise started, ended, or running?
    // - Default is not started
    const [exerciseStatus, setExerciseStatus] = useState(getExerciseStatus());
    // Store exercise status when changed
    useEffect(() => {
        storeExerciseStatus(exerciseStatus);
    }, [exerciseStatus]);
    // Exercise type
    // - What exercise is running?
    // - Default no exercise type running
    // - Should start an exercise if it detects one is running on startup
    const [exerciseType, setExerciseType] = useState(getExerciseType());
    // Store exercise type when changed
    useEffect(() => {
        storeExerciseType(exerciseType);
    }, [exerciseType]);
    // All relevant datasets to use for generating an exercise
    // - Holds a [List] of {sectionId: "Dataset Section", dataSetId: "Which dataset to pull"}
    // - Starts off blank
    // - Can add to these by selecting options from the exercise options tab
    const [exerciseDatasetInfo, setExerciseDatasetInfo] = useState<
        DataGroupId[]
    >(getExerciseDatasetInfo());
    // Store exercise dataset info when changed
    useEffect(() => {
        storeExerciseDatasetInfo(exerciseDatasetInfo);
    }, [exerciseDatasetInfo]);
    // Is an exercise in the list
    function isExerciseSelected(newExerciseDatasetInfo: DataGroupId) {
        const result = exerciseDatasetInfo.some(
            (e) =>
                e.sectionId == newExerciseDatasetInfo.sectionId &&
                e.dataSetId == newExerciseDatasetInfo.dataSetId,
        );
        return result;
    }
    // Holds all relevant data for the exercise
    // - Stores as a [List] of {jp: "Hiragana", en: "English Def"}
    // - Generated when a new exercise is selected
    const [currentExerciseItems, setCurrentExerciseItems] = useState<any[]>([]);
    // Remaining exercise items
    // - Holds all indicies from currentExerciseItems that are viable options to select for the current card
    // - In infinite mode, this never changes
    // - In bag mode, these items are removed on correct answer select
    const [remainingExerciseItemIndicies, setRemainingExerciseItemIndices] =
        useState<number[]>([]);
    // Current display item (vocab word)
    const [currentVocabWordIndex, setCurrentVocabWordIndex] =
        useState<number>(0);
    // Storage for the previously selected vocab word
    const [prevSelectionInfo, setPrevSelectionInfo] =
        useState<PrevSelectionInfo>(EMPTY_PREV_SELECT);
    // Get correct / incorrect selection text based on card type
    function getCorrectSelectionTextElement() {
        // Unpack items
        const prevCorrectItem =
            currentExerciseItems[prevSelectionInfo.correct_index];
        // If card is of type jp / en
        if (prevCorrectItem['jp'] && prevCorrectItem['en']) {
            return (
                <>
                    <p>
                        {appSettings.vocabSideStart == 'jp'
                            ? prevCorrectItem['jp']
                            : prevCorrectItem['en']}
                        →{' '}
                        {appSettings.vocabSideStart == 'jp'
                            ? prevCorrectItem['en']
                            : prevCorrectItem['jp']}
                        <br />✅
                    </p>
                </>
            );
        }
    }
    function getIncorrectSelectionTextElement() {
        // Unpack items
        const prevCorrectItem =
            currentExerciseItems[prevSelectionInfo.correct_index];
        // const prevSelectedItem =
        //     currentExerciseItems[prevSelectionInfo.selected_index];
        // If card is of type jp / en
        if (prevCorrectItem['jp'] && prevCorrectItem['en']) {
            return (
                <>
                    <p>
                        {appSettings.vocabSideStart == 'jp'
                            ? prevCorrectItem['jp']
                            : prevCorrectItem['en']}
                        →{' '}
                        {appSettings.vocabSideStart == 'jp'
                            ? prevCorrectItem['en']
                            : prevCorrectItem['jp']}
                        <br />❌
                    </p>
                </>
            );
        }
    }
    // Get current vocab word display
    function getCurrentWordDisplay() {
        if (exerciseStatus == ExerciseStatus.NoneSelected) {
            return 'No Exercise Started';
        } else if (exerciseStatus == ExerciseStatus.Finished) {
            return 'Exercise Finished';
        } else if (
            currentExerciseItems[currentVocabWordIndex]['jp'] &&
            currentExerciseItems[currentVocabWordIndex]['en']
        ) {
            // If word is jp / eng
            return currentExerciseItems[currentVocabWordIndex][
                appSettings.vocabSideStart
            ];
        }
    }
    // Current display items
    const [itemOptions, setItemOptions] = useState<any[]>([]);
    /**
     * Select vocab word and set item options
     */
    function selectNewVocabWord(
        currentExerciseItems: any,
        remainingExerciseItemIndicesCopy: number[],
    ) {
        // If no words remaining, exercise is over
        if (remainingExerciseItemIndicesCopy.length == 0) {
            setExerciseStatus(ExerciseStatus.Finished);
            setRemainingExerciseItemIndices([]);
            return;
        }
        // Select a random index from the remaining exercise items as the new word
        let newWordIndex: number =
            remainingExerciseItemIndicesCopy[
                Math.floor(
                    Math.random() * remainingExerciseItemIndicesCopy.length,
                )
            ];
        // Pull a number of random filler indices to fill out the list
        let indicesToPickFrom = Array.from(currentExerciseItems.keys());
        shuffleArray(indicesToPickFrom);
        indicesToPickFrom = indicesToPickFrom
            .slice(0, appSettings.selectableOptions)
            .filter((i) => i != newWordIndex)
            .filter((_, i) => i < appSettings.selectableOptions - 1);
        indicesToPickFrom.push(newWordIndex);
        shuffleArray(indicesToPickFrom);
        // Set the remaining exercise items and the new item options
        setCurrentVocabWordIndex(newWordIndex);
        setRemainingExerciseItemIndices(remainingExerciseItemIndicesCopy);
        setItemOptions(indicesToPickFrom);
    }

    /**
     * Start an exercise given an exercise type
     */
    function startExercise(startedExerciseType: ExerciseType) {
        // Set the exercise type
        setExerciseType(startedExerciseType);

        // Load the selected exercise datasets
        let selectedDataSetItems: any = [];
        exerciseDatasetInfo.forEach((dataSetInfo: DataGroupId) => {
            // Find the corresponding data group
            dataGroups.some((dataGroup: any) => {
                let found: boolean = false;
                if (dataGroup.sectionId == dataSetInfo.sectionId) {
                    dataGroup.dataSets.some((dataSet: any) => {
                        if (dataSet.dataSetId == dataSetInfo.dataSetId) {
                            // Append data to dataset items
                            selectedDataSetItems = selectedDataSetItems.concat(
                                dataSet.data,
                            );
                            found = true;
                        }
                        return found;
                    });
                }
                return found;
            });
        });
        setCurrentExerciseItems(selectedDataSetItems);
        let remainingExerciseItemIndicesCopy: number[] = Array.from(
            selectedDataSetItems.keys(),
        );
        // If bag mode, duplicate a number of times depending on bag amount
        if (startedExerciseType == ExerciseType.BagMode) {
            for (let i = 0; i < appSettings.bagModeCount - 1; i++)
                remainingExerciseItemIndicesCopy =
                    remainingExerciseItemIndicesCopy.concat(
                        Array.from(selectedDataSetItems.keys()),
                    );
        }

        // Clear out previous selection
        setPrevSelectionInfo(EMPTY_PREV_SELECT);

        // Generate first set of exercise items
        selectNewVocabWord(
            selectedDataSetItems,
            remainingExerciseItemIndicesCopy,
        );

        // Set exercise to started
        setExerciseStatus(ExerciseStatus.Running);
    }

    // Handle select item fn
    function handleSelectedItemFn(selectedItemIndex: number) {
        // First, determine if selection is right or wrong depending on selected index
        const selectionCorrect: boolean =
            selectedItemIndex == currentVocabWordIndex;
        // Generate new exercise items list accordingly
        let newRemainingExerciseItemIndicies: number[] = [
            ...remainingExerciseItemIndicies,
        ];
        // If bag mode
        if (exerciseType == ExerciseType.BagMode) {
            // If correct, remove one copy of item from bag
            if (selectionCorrect) {
                let oneCopyRemoved = false;
                newRemainingExerciseItemIndicies =
                    newRemainingExerciseItemIndicies.filter((itemIndex) => {
                        // If found
                        if (itemIndex == selectedItemIndex) {
                            // If a copy has not been removed, we want to remove this copy
                            if (!oneCopyRemoved) {
                                oneCopyRemoved = true;
                                return false;
                            }
                        }
                        // Otherwise, keep in the list
                        return true;
                    });
            }
            // If incorrect, keep in the bag
        }
        // If infinite mode
        if (exerciseType == ExerciseType.InfiniteMode) {
            // Don't need to handle any logic here
        }
        // Update prev vocab word value
        setPrevSelectionInfo({
            selected_index: selectedItemIndex,
            correct_index: currentVocabWordIndex,
        });
        // Select a new word using the updated item indicies
        selectNewVocabWord(
            currentExerciseItems,
            newRemainingExerciseItemIndicies,
        );
    }

    // Handle which popup container is open
    // - Default to PopupContainer.None
    const [currentPopupContainer, setCurrentPopupContainer] = useState(
        PopupContainer.None,
    );

    return (
        <>
            {/**
             * Popup Container
             * - App Settings
             * - Exercise Options
             */}
            {currentPopupContainer != PopupContainer.None && (
                <div
                    className="popup_container"
                    onClick={() =>
                        setCurrentPopupContainer(PopupContainer.None)
                    }
                >
                    <div
                        className="popup_subcontainer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {
                            /**
                             * Exercise Settings Container
                             */
                            currentPopupContainer ==
                                PopupContainer.ExerciseOptions && (
                                <div className="popup_exercise_options">
                                    <div className="select_exercise_type_container">
                                        {/**
                                         * Select which exercise to run
                                         */}
                                        <button
                                            className="select_exercise_type_btn"
                                            disabled={
                                                exerciseDatasetInfo.length == 0
                                            }
                                            onClick={() => {
                                                startExercise(
                                                    ExerciseType.InfiniteMode,
                                                );
                                                setCurrentPopupContainer(
                                                    PopupContainer.None,
                                                );
                                            }}
                                        >
                                            Start Infinite Mode
                                        </button>
                                        {/**
                                         * Select which datasets are enabled / disabled
                                         */}
                                        <button
                                            className="select_exercise_type_btn"
                                            disabled={
                                                exerciseDatasetInfo.length == 0
                                            }
                                            onClick={() => {
                                                startExercise(
                                                    ExerciseType.BagMode,
                                                );
                                                setCurrentPopupContainer(
                                                    PopupContainer.None,
                                                );
                                            }}
                                        >
                                            Start Bag Mode
                                        </button>
                                    </div>
                                    <div className="exercise_options_container">
                                        {dataGroups.map((dataGroup: any) => {
                                            return (
                                                <div key={dataGroup.sectionId}>
                                                    <h2 className="data_group_header">
                                                        {
                                                            dataGroup.sectionDisplayName
                                                        }
                                                    </h2>
                                                    <hr className="data_group_divider"></hr>
                                                    <div className="data_group_buttons">
                                                        {dataGroup.dataSets.map(
                                                            (dataSet: any) => {
                                                                // Dataset to add / remove
                                                                const addDataSet: DataGroupId =
                                                                    {
                                                                        sectionId:
                                                                            dataGroup.sectionId,
                                                                        dataSetId:
                                                                            dataSet.dataSetId,
                                                                    };
                                                                return (
                                                                    <button
                                                                        key={
                                                                            dataGroup.sectionId +
                                                                            dataSet.dataSetId
                                                                        }
                                                                        className={[
                                                                            'data_set_select_btn',
                                                                            isExerciseSelected(
                                                                                addDataSet,
                                                                            ) &&
                                                                                'data_set_selected',
                                                                        ].join(
                                                                            ' ',
                                                                        )}
                                                                        onClick={() => {
                                                                            // Add if not included
                                                                            if (
                                                                                !isExerciseSelected(
                                                                                    addDataSet,
                                                                                )
                                                                            ) {
                                                                                setExerciseDatasetInfo(
                                                                                    [
                                                                                        ...exerciseDatasetInfo,
                                                                                        addDataSet,
                                                                                    ],
                                                                                );
                                                                            }
                                                                            // Remove if included
                                                                            else {
                                                                                setExerciseDatasetInfo(
                                                                                    exerciseDatasetInfo.filter(
                                                                                        (
                                                                                            dataSet,
                                                                                        ) => {
                                                                                            return (
                                                                                                dataSet.sectionId !=
                                                                                                    addDataSet.sectionId ||
                                                                                                dataSet.dataSetId !=
                                                                                                    addDataSet.dataSetId
                                                                                            );
                                                                                        },
                                                                                    ),
                                                                                );
                                                                            }
                                                                        }}
                                                                    >
                                                                        {
                                                                            dataSet.displayName
                                                                        }
                                                                    </button>
                                                                );
                                                            },
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )
                        }
                        {
                            /**
                             * App Options
                             */
                            currentPopupContainer ==
                                PopupContainer.AppSettings && (
                                <div className="popup_app_options">
                                    <form>
                                        {/**
                                         * Bag Mode Duplicates
                                         */}
                                        <label>Bag Mode Duplicates:</label>
                                        <select
                                            onChange={(val) => {
                                                setAppSettings({
                                                    ...appSettings,
                                                    bagModeCount: parseInt(
                                                        val.target.value,
                                                    ),
                                                });
                                            }}
                                            defaultValue={
                                                appSettings.bagModeCount
                                            }
                                        >
                                            <option value={4}>4</option>
                                            <option value={3}>3</option>
                                            <option value={2}>2</option>
                                            <option value={1}>1</option>
                                        </select>
                                        <br />
                                        {/**
                                         * Possible Selectable Answers
                                         */}
                                        <label>
                                            Possible Answer Selections:
                                        </label>
                                        <select
                                            onChange={(val) => {
                                                setAppSettings({
                                                    ...appSettings,
                                                    selectableOptions: parseInt(
                                                        val.target.value,
                                                    ),
                                                });
                                            }}
                                            defaultValue={
                                                appSettings.selectableOptions
                                            }
                                        >
                                            {[
                                                10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
                                            ].map((val) => {
                                                return (
                                                    <option
                                                        value={val}
                                                        key={val}
                                                    >
                                                        {val}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <br />
                                        {/**
                                         * Vocab Start Side
                                         */}
                                        <label>Translate From:</label>
                                        <select
                                            onChange={(val) => {
                                                setAppSettings({
                                                    ...appSettings,
                                                    vocabSideStart:
                                                        val.target.value,
                                                });
                                            }}
                                            defaultValue={
                                                appSettings.vocabSideStart
                                            }
                                        >
                                            <option value="jp">Japanese</option>
                                            <option value="en">English</option>
                                        </select>
                                        <br />
                                    </form>
                                </div>
                            )
                        }
                    </div>
                </div>
            )}
            {/**
             * Main App View
             * - Current Exercise
             * - Popup Menu Open Buttons
             * - Exercise Progress Info
             */}
            <div className="app_main">
                {/**
                 * Nav Bar
                 */}
                <div className="nav_bar">
                    {/**
                     * Open app settings
                     */}
                    <button
                        className="settings_btn"
                        onClick={() =>
                            setCurrentPopupContainer(PopupContainer.AppSettings)
                        }
                    >
                        Settings
                    </button>
                    <div className="cur_word">{getCurrentWordDisplay()}</div>
                    {/**
                     * Open exercise options
                     */}
                    <button
                        className="exercise_options_btn"
                        onClick={() =>
                            setCurrentPopupContainer(
                                PopupContainer.ExerciseOptions,
                            )
                        }
                    >
                        Exercise
                    </button>
                </div>
                {/**
                 * Word Select Panel
                 */}
                <div className="word_select">
                    {
                        // If no exercise selected, prompt user to select one
                        exerciseStatus == ExerciseStatus.NoneSelected && (
                            <div className="no_exercise_started">
                                <button
                                    onClick={() =>
                                        setCurrentPopupContainer(
                                            PopupContainer.ExerciseOptions,
                                        )
                                    }
                                >
                                    Open Exercise Settings
                                </button>
                            </div>
                        )
                    }
                    {
                        // If exercise is over, prompt user for exercise restart or exercise edit
                        exerciseStatus == ExerciseStatus.Finished && (
                            <div className="exercise_finished">
                                <button
                                    onClick={() => startExercise(exerciseType)}
                                >
                                    Restart Exercise
                                </button>
                                <button
                                    onClick={() =>
                                        setCurrentPopupContainer(
                                            PopupContainer.ExerciseOptions,
                                        )
                                    }
                                >
                                    Open Exercise Settings
                                </button>
                            </div>
                        )
                    }
                    {
                        // If exercise in progress display word selection
                        exerciseStatus == ExerciseStatus.Running && (
                            <div className="item_select">
                                {itemOptions.map((itemOption: number) => {
                                    // Use item indices / settings to determine which side of the card to display
                                    //
                                    let exerciseItemRef: any =
                                        currentExerciseItems[itemOption];
                                    let displayText = '';
                                    let value = itemOption;
                                    // If jp / en card, display based on app settings
                                    if (
                                        exerciseItemRef['jp'] &&
                                        exerciseItemRef['en']
                                    ) {
                                        displayText =
                                            exerciseItemRef[
                                                appSettings.vocabSideStart ==
                                                'jp'
                                                    ? 'en'
                                                    : 'jp'
                                            ];
                                    }
                                    return (
                                        <button
                                            key={displayText + value}
                                            onClick={() =>
                                                handleSelectedItemFn(itemOption)
                                            }
                                        >
                                            {displayText}
                                        </button>
                                    );
                                })}
                            </div>
                        )
                    }
                </div>

                {/**
                 * Exercise Progress Info
                 * - Enabled if exercise started, shows either correct or incorrect variant
                 * - If in bag mode, show remaining text items
                 */}
                <div className="progress_info_container">
                    {exerciseStatus != ExerciseStatus.NoneSelected &&
                        prevSelectionInfo.correct_index != -1 &&
                        prevSelectionInfo.correct_index !=
                            prevSelectionInfo.selected_index && (
                            <>
                                <div className="progress_info_incorrect">
                                    {/**
                                     * Handle Jp -> Eng card
                                     */}
                                    {getIncorrectSelectionTextElement()}
                                </div>
                            </>
                        )}
                    {exerciseStatus != ExerciseStatus.NoneSelected &&
                        prevSelectionInfo.correct_index != -1 &&
                        prevSelectionInfo.correct_index ==
                            prevSelectionInfo.selected_index && (
                            <div className="progress_info_correct">
                                {getCorrectSelectionTextElement()}
                            </div>
                        )}
                    {exerciseType == ExerciseType.BagMode && (
                        <p className="progress_count">
                            Complete:{' '}
                            {appSettings.bagModeCount *
                                currentExerciseItems.length -
                                remainingExerciseItemIndicies.length}{' '}
                            of{' '}
                            {appSettings.bagModeCount *
                                currentExerciseItems.length}
                            .
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

export default App;
