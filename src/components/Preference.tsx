import { useAtom } from 'jotai';
import { preferencesAtom, updatePreferencesAtom, chordsAtom } from './../controller/atoms';
import { PreferencesAction, ToggleOptionProps } from '../types/interfaces';
import { checkChordsExists } from '../utils/utils';
import { guitarTunings } from '../utils/constants';

const ToggleOption: React.FC<ToggleOptionProps> = ({
	checked,
	onChange,
	label,
	type = 'checkbox',
	...props
}) => (
	<label className='flex items-center gap-2 text-xl accent-yellow-600'>
		<input className='h-4 w-4' type={type} checked={checked} onChange={onChange} {...props} />
		<p>{label}</p>
	</label>
);

export const Preference = () => {
	const [preferences] = useAtom(preferencesAtom);
	const [chords] = useAtom(chordsAtom);
	const [, setPreferences] = useAtom(updatePreferencesAtom);

	const handleSetPreferences = <T extends PreferencesAction>(pref: T) => {
		setPreferences(pref);
	};

	return (
		<div className='options flex flex-col p-4 pt-0'>
			<h2 className='text-2xl'>Chord Options</h2>

			<ToggleOption
				checked={
					preferences.showNotes ||
					(Object.keys(chords).length && !chords[preferences.activeChord ?? -1].intervals.length)
						? true
						: false
				}
				onChange={() => handleSetPreferences({ type: 'TOGGLE_PREFERENCE', key: 'showNotes' })}
				label='Show notes'
				type='radio'
			/>
			<ToggleOption
				disabled={
					!checkChordsExists(chords, preferences.activeChord ?? -1) ||
					chords[preferences.activeChord ?? -1]?.empty ||
					false
				}
				checked={!preferences.showNotes}
				onChange={() => handleSetPreferences({ type: 'TOGGLE_PREFERENCE', key: 'showNotes' })}
				label='Show Intervals'
				type='radio'
			/>
			<ToggleOption
				id='show-chord-tones'
				checked={preferences.showChordTones}
				onChange={() => handleSetPreferences({ type: 'TOGGLE_PREFERENCE', key: 'showChordTones' })}
				label='Show chord tones'
			/>
			<ToggleOption
				id='chord-information'
				checked={preferences.showMoreChordInfo}
				onChange={() => handleSetPreferences({ type: 'TOGGLE_SHOW_MORE_CHORD_INFO' })}
				label='More chord information'
			/>
			<ToggleOption
				id='show-scales'
				checked={preferences.showScales}
				onChange={() => handleSetPreferences({ type: 'TOGGLE_PREFERENCE', key: 'showScales' })}
				label='Show Scales'
			/>
			<ToggleOption
				id='highlight-notes'
				checked={preferences.highlightNotes}
				onChange={() => handleSetPreferences({ type: 'TOGGLE_PREFERENCE', key: 'highlightNotes' })}
				label='Highlight Notes'
			/>
			<ToggleOption
				id='highlightPosition'
				checked={preferences.highlightPosition}
				onChange={() =>
					handleSetPreferences({ type: 'TOGGLE_PREFERENCE', key: 'highlightPosition' })
				}
				label='Highlight Position (experimental)'
			/>

			<label className='flex items-center gap-2 text-xl text-white'>
				<select
					value={preferences.guitarTuning}
					onChange={(event) =>
						handleSetPreferences({ type: 'SET_GUITAR_TUNING', guitarTuning: event.target.value })
					}
					className='h-8 w-full rounded-md border border-gray-600 bg-gray-800'
				>
					{Object.keys(guitarTunings).map((val, idx) => {
						return (
							<option key={idx} value={val}>
								{val}
							</option>
						);
					})}
				</select>
			</label>
		</div>
	);
};
