import { get, post } from 'app/lib/ows/api';

export const fetchMachineProfiles = () => get('machines');

export const submitMachineProfileSuggestion = (payload) => post('machines/suggest', payload);
