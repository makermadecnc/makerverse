import { get } from 'app/lib/ows/api';

export const fetchMachineProfiles = () => get('machines');
