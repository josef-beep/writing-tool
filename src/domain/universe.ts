import { closed, isUuid, validProfile, type ProfileData } from './validation';
export type ProfileEnvelope = {
    schemaVersion: 1;
    recordType: 'universe-profile';
    id: string;
    owner: {
        kind: 'universe';
        id: string;
    };
    universeId: string;
    recordVersion: string;
    data: ProfileData;
};
export function profileData(data: ProfileData): ProfileData {
    if (!validProfile(data) || !data.name.trim())
        throw new Error('A universe name is required.');
    return { name: data.name.trim(), description: data.description };
}
export function validEnvelope(v: unknown): v is ProfileEnvelope {
    return closed(v, ['schemaVersion', 'recordType', 'id', 'owner', 'universeId', 'recordVersion', 'data']) && v.schemaVersion === 1 && v.recordType === 'universe-profile' && isUuid(v.id) && v.universeId === v.id && isUuid(v.recordVersion) && closed(v.owner, ['kind', 'id']) && v.owner.kind === 'universe' && v.owner.id === v.id && validProfile(v.data) && !!v.data.name.trim() && v.data.name === v.data.name.trim();
}
