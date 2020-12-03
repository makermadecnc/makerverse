import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The built-in `Decimal` scalar type. */
  Decimal: any;
  /** The `DateTime` scalar represents an ISO-8601 compliant date time type. */
  DateTime: any;
  /** The `Long` scalar type represents non-fractional signed whole 64-bit numeric values. Long can represent values between -(2^63) and 2^63 - 1. */
  Long: any;
};

export type AppUpdates = {
  __typename?: 'AppUpdates';
  checkForUpdates: Scalars['Boolean'];
  prereleases: Scalars['Boolean'];
};

export type CommandSettings = {
  __typename?: 'CommandSettings';
  commands: Scalars['String'];
  enabled: Scalars['Boolean'];
  id: Scalars['String'];
  mtime: Scalars['Long'];
  title: Scalars['String'];
};

export type ConnectedPort = {
  __typename?: 'ConnectedPort';
  createdAt: Scalars['DateTime'];
  firmwareRequirement: FirmwareRequirement;
  friendlyName: Scalars['String'];
  machine: Machine;
  port: SystemPort;
  status: PortStatus;
};

export type ConnectionSettings = {
  __typename?: 'ConnectionSettings';
  firmware: MachineFirmwareSettings;
  manufacturer: Maybe<Scalars['String']>;
  portName: Scalars['String'];
};

export type EventSettings = {
  __typename?: 'EventSettings';
  commands: Scalars['String'];
  enabled: Scalars['Boolean'];
  event: Scalars['String'];
  id: Scalars['String'];
  mtime: Scalars['Long'];
  trigger: Scalars['String'];
};

export type FileSystemSettings = {
  __typename?: 'FileSystemSettings';
  mountPoints: Array<MountPointSettings>;
  programDirectory: Scalars['String'];
};

export type FirmwareRequirement = {
  __typename?: 'FirmwareRequirement';
  controllerType: MachineControllerType;
  edition: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
  value: Maybe<Scalars['Decimal']>;
};

export type Machine = {
  __typename?: 'Machine';
  configuration: MachineConfiguration;
  machineProfileId: Maybe<Scalars['String']>;
  settings: Array<MachineSetting>;
  state: MachineState;
};

export type MachineAlert = {
  __typename?: 'MachineAlert';
  code: Scalars['String'];
  message: Scalars['String'];
  name: Scalars['String'];
};

export type MachineAxisSettings = {
  __typename?: 'MachineAxisSettings';
  accuracy: Scalars['Decimal'];
  id: Maybe<Scalars['String']>;
  max: Scalars['Decimal'];
  min: Scalars['Decimal'];
  name: AxisName;
  precision: Scalars['Decimal'];
};

export type MachineCommandSettings = {
  __typename?: 'MachineCommandSettings';
  id: Scalars['String'];
  name: Scalars['String'];
  value: Scalars['String'];
};

export type MachineConfiguration = {
  __typename?: 'MachineConfiguration';
  firmware: MachineDetectedFirmware;
  workOffset: MachinePosition;
};

export type MachineDetectedFirmware = {
  __typename?: 'MachineDetectedFirmware';
  edition: Maybe<Scalars['String']>;
  friendlyName: Maybe<Scalars['String']>;
  isValid: Scalars['Boolean'];
  name: Scalars['String'];
  protocol: Maybe<Scalars['String']>;
  value: Maybe<Scalars['Decimal']>;
  welcomeMessage: Maybe<Scalars['String']>;
};

export type MachineFeatureSettings = {
  __typename?: 'MachineFeatureSettings';
  description: Maybe<Scalars['String']>;
  disabled: Scalars['Boolean'];
  icon: Maybe<Scalars['String']>;
  id: Maybe<Scalars['String']>;
  key: Scalars['String'];
  title: Maybe<Scalars['String']>;
};

export type MachineFirmwareSettings = {
  __typename?: 'MachineFirmwareSettings';
  baudRate: Maybe<BaudRate>;
  baudRateValue: Scalars['Int'];
  controllerType: MachineControllerType;
  downloadUrl: Maybe<Scalars['String']>;
  edition: Maybe<Scalars['String']>;
  helpUrl: Maybe<Scalars['String']>;
  id: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
  requiredVersion: Scalars['Decimal'];
  rtscts: Scalars['Boolean'];
  suggestedVersion: Scalars['Decimal'];
};

export type MachinePartSettings = {
  __typename?: 'MachinePartSettings';
  dataBlob: Scalars['String'];
  description: Maybe<Scalars['String']>;
  id: Maybe<Scalars['String']>;
  isDefault: Scalars['Boolean'];
  optional: Scalars['Boolean'];
  partType: MachinePartType;
  settings: Array<MachineSettingSettings>;
  specs: Array<MachineSpecSettings>;
  title: Maybe<Scalars['String']>;
};

export type MachinePosition = {
  __typename?: 'MachinePosition';
  e: Maybe<Scalars['Decimal']>;
  x: Scalars['Decimal'];
  y: Maybe<Scalars['Decimal']>;
  z: Maybe<Scalars['Decimal']>;
};

export type MachineSetting = {
  __typename?: 'MachineSetting';
  id: Scalars['String'];
  key: Scalars['String'];
  settingType: MachineSettingType;
  title: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

export type MachineSettingSettings = {
  __typename?: 'MachineSettingSettings';
  id: Scalars['String'];
  key: Scalars['String'];
  settingType: MachineSettingType;
  title: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

export type MachineSpecSettings = {
  __typename?: 'MachineSpecSettings';
  id: Scalars['String'];
  specType: MachineSpecType;
  value: Scalars['Decimal'];
};

export type MachineState = {
  __typename?: 'MachineState';
  alarm: Maybe<MachineAlert>;
  error: Maybe<MachineAlert>;
  machinePosition: MachinePosition;
  state: ActiveState;
  workPosition: Maybe<MachinePosition>;
};

export type MacroSettings = {
  __typename?: 'MacroSettings';
  content: Scalars['String'];
  id: Scalars['String'];
  mtime: Scalars['Long'];
  name: Scalars['String'];
};

export type MakerHubSettings = {
  __typename?: 'MakerHubSettings';
  enabled: Scalars['Boolean'];
};

export type MakerverseSession = {
  __typename?: 'MakerverseSession';
  roles: Array<Scalars['String']>;
  token: Scalars['String'];
  user: MakerverseUser;
};

export type MakerverseSettings = {
  __typename?: 'MakerverseSettings';
  appUpdates: AppUpdates;
  commands: Array<CommandSettings>;
  events: Array<EventSettings>;
  fileSystem: FileSystemSettings;
  hub: MakerHubSettings;
  macros: Array<MacroSettings>;
  users: Array<MakerverseUser>;
  workspaces: Array<WorkspaceSettings>;
};

export type MakerverseUser = {
  __typename?: 'MakerverseUser';
  authenticationType: Scalars['String'];
  enabled: Scalars['Boolean'];
  id: Maybe<Scalars['String']>;
  tokens: Array<Scalars['String']>;
  username: Scalars['String'];
};

export type MountPointSettings = {
  __typename?: 'MountPointSettings';
  route: Scalars['String'];
  target: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  closePort: SystemPort;
  createWorkspace: WorkspaceSettings;
  deleteWorkspace: Scalars['String'];
  openPort: SystemPort;
  updateWorkspace: WorkspaceSettings;
};


export type MutationClosePortArgs = {
  portName: Scalars['String'];
};


export type MutationCreateWorkspaceArgs = {
  workspaceSettings: WorkspaceSettingsInput;
};


export type MutationDeleteWorkspaceArgs = {
  workspaceId: Scalars['String'];
};


export type MutationOpenPortArgs = {
  firmware: FirmwareRequirementInput;
  friendlyName: Scalars['String'];
  options: SerialPortOptionsInput;
  portName: Scalars['String'];
};


export type MutationUpdateWorkspaceArgs = {
  workspaceSettings: WorkspaceSettingsInput;
};

export type PortError = {
  __typename?: 'PortError';
  message: Scalars['String'];
  name: Scalars['String'];
};

export type PortOptions = {
  __typename?: 'PortOptions';
  baudRate: Scalars['Int'];
  dataBits: Maybe<Scalars['Int']>;
  handshake: Maybe<Handshake>;
  parity: Maybe<Parity>;
  readBufferSize: Maybe<Scalars['Int']>;
  readTimeout: Maybe<Scalars['Int']>;
  rtsEnable: Maybe<Scalars['Boolean']>;
  stopBits: Maybe<StopBits>;
  writeBufferSize: Maybe<Scalars['Int']>;
  writeTimeout: Maybe<Scalars['Int']>;
};

export type PortStatus = {
  __typename?: 'PortStatus';
  bytesToRead: Scalars['Int'];
  bytesToWrite: Scalars['Int'];
  charactersRead: Scalars['Int'];
  charactersWritten: Scalars['Int'];
  isOpen: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  authenticate: MakerverseSession;
  getPort: SystemPort;
  getSettings: MakerverseSettings;
  getWorkspace: WorkspaceSettings;
  listPorts: Array<SystemPort>;
  workspace: WorkspaceSettings;
};


export type QueryAuthenticateArgs = {
  token: Scalars['String'];
};


export type QueryGetPortArgs = {
  portName: Scalars['String'];
};


export type QueryGetWorkspaceArgs = {
  idOrPath: Scalars['String'];
};


export type QueryWorkspaceArgs = {
  workspaceId: Maybe<Scalars['String']>;
  workspaceName: Maybe<Scalars['String']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  onMachineConfiguration: MachineConfiguration;
  onMachineSetting: MachineSetting;
  onMachineState: MachineState;
  onPortList: Array<SystemPort>;
  onPortStatus: SystemPort;
  onWorkspacesChanged: WorkspaceChange;
  openWorkspace: Workspace;
};


export type SubscriptionOnMachineConfigurationArgs = {
  portName: Scalars['String'];
};


export type SubscriptionOnMachineSettingArgs = {
  portName: Scalars['String'];
};


export type SubscriptionOnMachineStateArgs = {
  portName: Scalars['String'];
};


export type SubscriptionOpenWorkspaceArgs = {
  workspaceId: Scalars['String'];
};

export type SystemPort = {
  __typename?: 'SystemPort';
  connection: Maybe<ConnectedPort>;
  error: Maybe<PortError>;
  options: PortOptions;
  portName: Scalars['String'];
  state: PortState;
};

export type Workspace = {
  __typename?: 'Workspace';
  settings: WorkspaceSettings;
  state: WorkspaceState;
  workspaceId: Scalars['String'];
};

export type WorkspaceChange = {
  __typename?: 'WorkspaceChange';
  workspace: Maybe<Workspace>;
  workspaceId: Scalars['String'];
};

export type WorkspaceSettings = {
  __typename?: 'WorkspaceSettings';
  autoReconnect: Scalars['Boolean'];
  axes: Array<MachineAxisSettings>;
  bkColor: Maybe<Scalars['String']>;
  color: Maybe<Scalars['String']>;
  commands: Array<MachineCommandSettings>;
  connection: ConnectionSettings;
  features: Array<MachineFeatureSettings>;
  icon: Maybe<Scalars['String']>;
  id: Scalars['String'];
  machineProfileId: Maybe<Scalars['String']>;
  name: Scalars['String'];
  onboarded: Scalars['Boolean'];
  parts: Array<MachinePartSettings>;
  path: Scalars['String'];
  preferImperial: Scalars['Boolean'];
};

export enum ActiveState {
  Alarm = 'ALARM',
  Check = 'CHECK',
  Door = 'DOOR',
  Hold = 'HOLD',
  Home = 'HOME',
  IdleReady = 'IDLE_READY',
  Initializing = 'INITIALIZING',
  Run = 'RUN',
  Sleep = 'SLEEP'
}

export enum ApplyPolicy {
  AfterResolver = 'AFTER_RESOLVER',
  BeforeResolver = 'BEFORE_RESOLVER'
}

export enum AxisName {
  X = 'X',
  Y = 'Y',
  Z = 'Z'
}

export enum BaudRate {
  Br115200 = 'BR115200',
  Br19200 = 'BR19200',
  Br2400 = 'BR2400',
  Br250000 = 'BR250000',
  Br38400 = 'BR38400',
  Br57600 = 'BR57600',
  Br9600 = 'BR9600'
}

export enum Handshake {
  None = 'NONE',
  RequestToSend = 'REQUEST_TO_SEND',
  RequestToSendXOnXOff = 'REQUEST_TO_SEND_X_ON_X_OFF',
  XOnXOff = 'X_ON_X_OFF'
}

export enum MachineControllerType {
  Grbl = 'GRBL',
  Marlin = 'MARLIN',
  Maslow = 'MASLOW',
  Smoothie = 'SMOOTHIE',
  TinyG = 'TINY_G',
  Unknown = 'UNKNOWN'
}

export enum MachinePartType {
  AxisMotor = 'AXIS_MOTOR',
  Board = 'BOARD',
  EmergencyStop = 'EMERGENCY_STOP',
  Heatbed = 'HEATBED',
  Hotend = 'HOTEND',
  LimitSwitches = 'LIMIT_SWITCHES',
  Mmu = 'MMU',
  Nozzle = 'NOZZLE',
  Psu = 'PSU',
  Shield = 'SHIELD',
  Sled = 'SLED',
  Spindle = 'SPINDLE',
  Unknown = 'UNKNOWN'
}

export enum MachineSettingType {
  Grbl = 'GRBL',
  Kv = 'KV'
}

export enum MachineSpecType {
  MaxAmps = 'MAX_AMPS',
  MaxLayerHeight = 'MAX_LAYER_HEIGHT',
  MaxRpm = 'MAX_RPM',
  MaxTemp = 'MAX_TEMP',
  MaxTravelSpeed = 'MAX_TRAVEL_SPEED',
  MaxVolts = 'MAX_VOLTS',
  MaxWatts = 'MAX_WATTS',
  MinLayerHeight = 'MIN_LAYER_HEIGHT',
  NumberOfMaterials = 'NUMBER_OF_MATERIALS',
  TipSize = 'TIP_SIZE',
  Watts = 'WATTS',
  WaveLength = 'WAVE_LENGTH'
}

export enum Parity {
  Even = 'EVEN',
  Mark = 'MARK',
  None = 'NONE',
  Odd = 'ODD',
  Space = 'SPACE'
}

export enum PortState {
  Active = 'ACTIVE',
  Error = 'ERROR',
  HasData = 'HAS_DATA',
  HasFirmware = 'HAS_FIRMWARE',
  Opening = 'OPENING',
  Ready = 'READY',
  Startup = 'STARTUP',
  Unknown = 'UNKNOWN'
}

export enum StopBits {
  None = 'NONE',
  One = 'ONE',
  OnePointFive = 'ONE_POINT_FIVE',
  Two = 'TWO'
}

export enum WorkspaceState {
  Closed = 'CLOSED',
  Opened = 'OPENED',
  Opening = 'OPENING'
}

export type ConnectionSettingsInput = {
  firmware: MachineFirmwareSettingsInput;
  manufacturer: Maybe<Scalars['String']>;
  portName: Scalars['String'];
};

export type FirmwareRequirementInput = {
  controllerType: MachineControllerType;
  edition: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
  value: Maybe<Scalars['Decimal']>;
};

export type MachineAxisSettingsInput = {
  accuracy: Scalars['Decimal'];
  id: Maybe<Scalars['String']>;
  max: Scalars['Decimal'];
  min: Scalars['Decimal'];
  name: AxisName;
  precision: Scalars['Decimal'];
};

export type MachineCommandSettingsInput = {
  id: Scalars['String'];
  name: Scalars['String'];
  value: Scalars['String'];
};

export type MachineFeatureSettingsInput = {
  description: Maybe<Scalars['String']>;
  disabled: Scalars['Boolean'];
  icon: Maybe<Scalars['String']>;
  id: Maybe<Scalars['String']>;
  key: Scalars['String'];
  title: Maybe<Scalars['String']>;
};

export type MachineFirmwareSettingsInput = {
  baudRate: Maybe<BaudRate>;
  baudRateValue: Scalars['Int'];
  controllerType: MachineControllerType;
  downloadUrl: Maybe<Scalars['String']>;
  edition: Maybe<Scalars['String']>;
  helpUrl: Maybe<Scalars['String']>;
  id: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
  requiredVersion: Scalars['Decimal'];
  rtscts: Scalars['Boolean'];
  suggestedVersion: Scalars['Decimal'];
};

export type MachinePartSettingsInput = {
  dataBlob: Scalars['String'];
  description: Maybe<Scalars['String']>;
  id: Maybe<Scalars['String']>;
  isDefault: Scalars['Boolean'];
  optional: Scalars['Boolean'];
  partType: MachinePartType;
  settings: Array<MachineSettingSettingsInput>;
  specs: Array<MachineSpecSettingsInput>;
  title: Maybe<Scalars['String']>;
};

export type MachineSettingSettingsInput = {
  id: Scalars['String'];
  key: Scalars['String'];
  settingType: MachineSettingType;
  title: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

export type MachineSpecSettingsInput = {
  id: Scalars['String'];
  specType: MachineSpecType;
  value: Scalars['Decimal'];
};

export type SerialPortOptionsInput = {
  baudRate: Scalars['Int'];
  dataBits: Maybe<Scalars['Int']>;
  handshake: Maybe<Handshake>;
  parity: Maybe<Parity>;
  readBufferSize: Maybe<Scalars['Int']>;
  readTimeout: Maybe<Scalars['Int']>;
  rtsEnable: Maybe<Scalars['Boolean']>;
  stopBits: Maybe<StopBits>;
  writeBufferSize: Maybe<Scalars['Int']>;
  writeTimeout: Maybe<Scalars['Int']>;
};

export type WorkspaceSettingsInput = {
  autoReconnect: Scalars['Boolean'];
  axes: Array<MachineAxisSettingsInput>;
  bkColor: Maybe<Scalars['String']>;
  color: Maybe<Scalars['String']>;
  commands: Array<MachineCommandSettingsInput>;
  connection: ConnectionSettingsInput;
  features: Array<MachineFeatureSettingsInput>;
  icon: Maybe<Scalars['String']>;
  id: Scalars['String'];
  machineProfileId: Maybe<Scalars['String']>;
  name: Scalars['String'];
  onboarded: Scalars['Boolean'];
  parts: Array<MachinePartSettingsInput>;
  path: Scalars['String'];
  preferImperial: Scalars['Boolean'];
};






export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AppUpdates: ResolverTypeWrapper<AppUpdates>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CommandSettings: ResolverTypeWrapper<CommandSettings>;
  String: ResolverTypeWrapper<Scalars['String']>;
  ConnectedPort: ResolverTypeWrapper<ConnectedPort>;
  ConnectionSettings: ResolverTypeWrapper<ConnectionSettings>;
  EventSettings: ResolverTypeWrapper<EventSettings>;
  FileSystemSettings: ResolverTypeWrapper<FileSystemSettings>;
  FirmwareRequirement: ResolverTypeWrapper<FirmwareRequirement>;
  Machine: ResolverTypeWrapper<Machine>;
  MachineAlert: ResolverTypeWrapper<MachineAlert>;
  MachineAxisSettings: ResolverTypeWrapper<MachineAxisSettings>;
  MachineCommandSettings: ResolverTypeWrapper<MachineCommandSettings>;
  MachineConfiguration: ResolverTypeWrapper<MachineConfiguration>;
  MachineDetectedFirmware: ResolverTypeWrapper<MachineDetectedFirmware>;
  MachineFeatureSettings: ResolverTypeWrapper<MachineFeatureSettings>;
  MachineFirmwareSettings: ResolverTypeWrapper<MachineFirmwareSettings>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  MachinePartSettings: ResolverTypeWrapper<MachinePartSettings>;
  MachinePosition: ResolverTypeWrapper<MachinePosition>;
  MachineSetting: ResolverTypeWrapper<MachineSetting>;
  MachineSettingSettings: ResolverTypeWrapper<MachineSettingSettings>;
  MachineSpecSettings: ResolverTypeWrapper<MachineSpecSettings>;
  MachineState: ResolverTypeWrapper<MachineState>;
  MacroSettings: ResolverTypeWrapper<MacroSettings>;
  MakerHubSettings: ResolverTypeWrapper<MakerHubSettings>;
  MakerverseSession: ResolverTypeWrapper<MakerverseSession>;
  MakerverseSettings: ResolverTypeWrapper<MakerverseSettings>;
  MakerverseUser: ResolverTypeWrapper<MakerverseUser>;
  MountPointSettings: ResolverTypeWrapper<MountPointSettings>;
  Mutation: ResolverTypeWrapper<{}>;
  PortError: ResolverTypeWrapper<PortError>;
  PortOptions: ResolverTypeWrapper<PortOptions>;
  PortStatus: ResolverTypeWrapper<PortStatus>;
  Query: ResolverTypeWrapper<{}>;
  Subscription: ResolverTypeWrapper<{}>;
  SystemPort: ResolverTypeWrapper<SystemPort>;
  Workspace: ResolverTypeWrapper<Workspace>;
  WorkspaceChange: ResolverTypeWrapper<WorkspaceChange>;
  WorkspaceSettings: ResolverTypeWrapper<WorkspaceSettings>;
  ActiveState: ActiveState;
  ApplyPolicy: ApplyPolicy;
  AxisName: AxisName;
  BaudRate: BaudRate;
  Handshake: Handshake;
  MachineControllerType: MachineControllerType;
  MachinePartType: MachinePartType;
  MachineSettingType: MachineSettingType;
  MachineSpecType: MachineSpecType;
  Parity: Parity;
  PortState: PortState;
  StopBits: StopBits;
  WorkspaceState: WorkspaceState;
  ConnectionSettingsInput: ConnectionSettingsInput;
  FirmwareRequirementInput: FirmwareRequirementInput;
  MachineAxisSettingsInput: MachineAxisSettingsInput;
  MachineCommandSettingsInput: MachineCommandSettingsInput;
  MachineFeatureSettingsInput: MachineFeatureSettingsInput;
  MachineFirmwareSettingsInput: MachineFirmwareSettingsInput;
  MachinePartSettingsInput: MachinePartSettingsInput;
  MachineSettingSettingsInput: MachineSettingSettingsInput;
  MachineSpecSettingsInput: MachineSpecSettingsInput;
  SerialPortOptionsInput: SerialPortOptionsInput;
  WorkspaceSettingsInput: WorkspaceSettingsInput;
  Decimal: ResolverTypeWrapper<Scalars['Decimal']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Long: ResolverTypeWrapper<Scalars['Long']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AppUpdates: AppUpdates;
  Boolean: Scalars['Boolean'];
  CommandSettings: CommandSettings;
  String: Scalars['String'];
  ConnectedPort: ConnectedPort;
  ConnectionSettings: ConnectionSettings;
  EventSettings: EventSettings;
  FileSystemSettings: FileSystemSettings;
  FirmwareRequirement: FirmwareRequirement;
  Machine: Machine;
  MachineAlert: MachineAlert;
  MachineAxisSettings: MachineAxisSettings;
  MachineCommandSettings: MachineCommandSettings;
  MachineConfiguration: MachineConfiguration;
  MachineDetectedFirmware: MachineDetectedFirmware;
  MachineFeatureSettings: MachineFeatureSettings;
  MachineFirmwareSettings: MachineFirmwareSettings;
  Int: Scalars['Int'];
  MachinePartSettings: MachinePartSettings;
  MachinePosition: MachinePosition;
  MachineSetting: MachineSetting;
  MachineSettingSettings: MachineSettingSettings;
  MachineSpecSettings: MachineSpecSettings;
  MachineState: MachineState;
  MacroSettings: MacroSettings;
  MakerHubSettings: MakerHubSettings;
  MakerverseSession: MakerverseSession;
  MakerverseSettings: MakerverseSettings;
  MakerverseUser: MakerverseUser;
  MountPointSettings: MountPointSettings;
  Mutation: {};
  PortError: PortError;
  PortOptions: PortOptions;
  PortStatus: PortStatus;
  Query: {};
  Subscription: {};
  SystemPort: SystemPort;
  Workspace: Workspace;
  WorkspaceChange: WorkspaceChange;
  WorkspaceSettings: WorkspaceSettings;
  ConnectionSettingsInput: ConnectionSettingsInput;
  FirmwareRequirementInput: FirmwareRequirementInput;
  MachineAxisSettingsInput: MachineAxisSettingsInput;
  MachineCommandSettingsInput: MachineCommandSettingsInput;
  MachineFeatureSettingsInput: MachineFeatureSettingsInput;
  MachineFirmwareSettingsInput: MachineFirmwareSettingsInput;
  MachinePartSettingsInput: MachinePartSettingsInput;
  MachineSettingSettingsInput: MachineSettingSettingsInput;
  MachineSpecSettingsInput: MachineSpecSettingsInput;
  SerialPortOptionsInput: SerialPortOptionsInput;
  WorkspaceSettingsInput: WorkspaceSettingsInput;
  Decimal: Scalars['Decimal'];
  DateTime: Scalars['DateTime'];
  Long: Scalars['Long'];
};

export type AppUpdatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppUpdates'] = ResolversParentTypes['AppUpdates']> = {
  checkForUpdates: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  prereleases: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommandSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CommandSettings'] = ResolversParentTypes['CommandSettings']> = {
  commands: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enabled: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mtime: Resolver<ResolversTypes['Long'], ParentType, ContextType>;
  title: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ConnectedPortResolvers<ContextType = any, ParentType extends ResolversParentTypes['ConnectedPort'] = ResolversParentTypes['ConnectedPort']> = {
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  firmwareRequirement: Resolver<ResolversTypes['FirmwareRequirement'], ParentType, ContextType>;
  friendlyName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  machine: Resolver<ResolversTypes['Machine'], ParentType, ContextType>;
  port: Resolver<ResolversTypes['SystemPort'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['PortStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ConnectionSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['ConnectionSettings'] = ResolversParentTypes['ConnectionSettings']> = {
  firmware: Resolver<ResolversTypes['MachineFirmwareSettings'], ParentType, ContextType>;
  manufacturer: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  portName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['EventSettings'] = ResolversParentTypes['EventSettings']> = {
  commands: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enabled: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  event: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mtime: Resolver<ResolversTypes['Long'], ParentType, ContextType>;
  trigger: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FileSystemSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['FileSystemSettings'] = ResolversParentTypes['FileSystemSettings']> = {
  mountPoints: Resolver<Array<ResolversTypes['MountPointSettings']>, ParentType, ContextType>;
  programDirectory: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FirmwareRequirementResolvers<ContextType = any, ParentType extends ResolversParentTypes['FirmwareRequirement'] = ResolversParentTypes['FirmwareRequirement']> = {
  controllerType: Resolver<ResolversTypes['MachineControllerType'], ParentType, ContextType>;
  edition: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MachineResolvers<ContextType = any, ParentType extends ResolversParentTypes['Machine'] = ResolversParentTypes['Machine']> = {
  configuration: Resolver<ResolversTypes['MachineConfiguration'], ParentType, ContextType>;
  machineProfileId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  settings: Resolver<Array<ResolversTypes['MachineSetting']>, ParentType, ContextType>;
  state: Resolver<ResolversTypes['MachineState'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MachineAlertResolvers<ContextType = any, ParentType extends ResolversParentTypes['MachineAlert'] = ResolversParentTypes['MachineAlert']> = {
  code: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MachineAxisSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MachineAxisSettings'] = ResolversParentTypes['MachineAxisSettings']> = {
  accuracy: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  id: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  max: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  min: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['AxisName'], ParentType, ContextType>;
  precision: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MachineCommandSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MachineCommandSettings'] = ResolversParentTypes['MachineCommandSettings']> = {
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MachineConfigurationResolvers<ContextType = any, ParentType extends ResolversParentTypes['MachineConfiguration'] = ResolversParentTypes['MachineConfiguration']> = {
  firmware: Resolver<ResolversTypes['MachineDetectedFirmware'], ParentType, ContextType>;
  workOffset: Resolver<ResolversTypes['MachinePosition'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MachineDetectedFirmwareResolvers<ContextType = any, ParentType extends ResolversParentTypes['MachineDetectedFirmware'] = ResolversParentTypes['MachineDetectedFirmware']> = {
  edition: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  friendlyName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isValid: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  protocol: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
  welcomeMessage: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MachineFeatureSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MachineFeatureSettings'] = ResolversParentTypes['MachineFeatureSettings']> = {
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  disabled: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  icon: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  key: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MachineFirmwareSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MachineFirmwareSettings'] = ResolversParentTypes['MachineFirmwareSettings']> = {
  baudRate: Resolver<Maybe<ResolversTypes['BaudRate']>, ParentType, ContextType>;
  baudRateValue: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  controllerType: Resolver<ResolversTypes['MachineControllerType'], ParentType, ContextType>;
  downloadUrl: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  edition: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  helpUrl: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  requiredVersion: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  rtscts: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  suggestedVersion: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MachinePartSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MachinePartSettings'] = ResolversParentTypes['MachinePartSettings']> = {
  dataBlob: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isDefault: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  optional: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  partType: Resolver<ResolversTypes['MachinePartType'], ParentType, ContextType>;
  settings: Resolver<Array<ResolversTypes['MachineSettingSettings']>, ParentType, ContextType>;
  specs: Resolver<Array<ResolversTypes['MachineSpecSettings']>, ParentType, ContextType>;
  title: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MachinePositionResolvers<ContextType = any, ParentType extends ResolversParentTypes['MachinePosition'] = ResolversParentTypes['MachinePosition']> = {
  e: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
  x: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  y: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
  z: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MachineSettingResolvers<ContextType = any, ParentType extends ResolversParentTypes['MachineSetting'] = ResolversParentTypes['MachineSetting']> = {
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  key: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  settingType: Resolver<ResolversTypes['MachineSettingType'], ParentType, ContextType>;
  title: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MachineSettingSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MachineSettingSettings'] = ResolversParentTypes['MachineSettingSettings']> = {
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  key: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  settingType: Resolver<ResolversTypes['MachineSettingType'], ParentType, ContextType>;
  title: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MachineSpecSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MachineSpecSettings'] = ResolversParentTypes['MachineSpecSettings']> = {
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  specType: Resolver<ResolversTypes['MachineSpecType'], ParentType, ContextType>;
  value: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MachineStateResolvers<ContextType = any, ParentType extends ResolversParentTypes['MachineState'] = ResolversParentTypes['MachineState']> = {
  alarm: Resolver<Maybe<ResolversTypes['MachineAlert']>, ParentType, ContextType>;
  error: Resolver<Maybe<ResolversTypes['MachineAlert']>, ParentType, ContextType>;
  machinePosition: Resolver<ResolversTypes['MachinePosition'], ParentType, ContextType>;
  state: Resolver<ResolversTypes['ActiveState'], ParentType, ContextType>;
  workPosition: Resolver<Maybe<ResolversTypes['MachinePosition']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MacroSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MacroSettings'] = ResolversParentTypes['MacroSettings']> = {
  content: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mtime: Resolver<ResolversTypes['Long'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MakerHubSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MakerHubSettings'] = ResolversParentTypes['MakerHubSettings']> = {
  enabled: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MakerverseSessionResolvers<ContextType = any, ParentType extends ResolversParentTypes['MakerverseSession'] = ResolversParentTypes['MakerverseSession']> = {
  roles: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  token: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user: Resolver<ResolversTypes['MakerverseUser'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MakerverseSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MakerverseSettings'] = ResolversParentTypes['MakerverseSettings']> = {
  appUpdates: Resolver<ResolversTypes['AppUpdates'], ParentType, ContextType>;
  commands: Resolver<Array<ResolversTypes['CommandSettings']>, ParentType, ContextType>;
  events: Resolver<Array<ResolversTypes['EventSettings']>, ParentType, ContextType>;
  fileSystem: Resolver<ResolversTypes['FileSystemSettings'], ParentType, ContextType>;
  hub: Resolver<ResolversTypes['MakerHubSettings'], ParentType, ContextType>;
  macros: Resolver<Array<ResolversTypes['MacroSettings']>, ParentType, ContextType>;
  users: Resolver<Array<ResolversTypes['MakerverseUser']>, ParentType, ContextType>;
  workspaces: Resolver<Array<ResolversTypes['WorkspaceSettings']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MakerverseUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['MakerverseUser'] = ResolversParentTypes['MakerverseUser']> = {
  authenticationType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enabled: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tokens: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  username: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MountPointSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MountPointSettings'] = ResolversParentTypes['MountPointSettings']> = {
  route: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  target: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  closePort: Resolver<ResolversTypes['SystemPort'], ParentType, ContextType, RequireFields<MutationClosePortArgs, 'portName'>>;
  createWorkspace: Resolver<ResolversTypes['WorkspaceSettings'], ParentType, ContextType, RequireFields<MutationCreateWorkspaceArgs, 'workspaceSettings'>>;
  deleteWorkspace: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationDeleteWorkspaceArgs, 'workspaceId'>>;
  openPort: Resolver<ResolversTypes['SystemPort'], ParentType, ContextType, RequireFields<MutationOpenPortArgs, 'firmware' | 'friendlyName' | 'options' | 'portName'>>;
  updateWorkspace: Resolver<ResolversTypes['WorkspaceSettings'], ParentType, ContextType, RequireFields<MutationUpdateWorkspaceArgs, 'workspaceSettings'>>;
};

export type PortErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['PortError'] = ResolversParentTypes['PortError']> = {
  message: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PortOptionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PortOptions'] = ResolversParentTypes['PortOptions']> = {
  baudRate: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  dataBits: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  handshake: Resolver<Maybe<ResolversTypes['Handshake']>, ParentType, ContextType>;
  parity: Resolver<Maybe<ResolversTypes['Parity']>, ParentType, ContextType>;
  readBufferSize: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  readTimeout: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  rtsEnable: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  stopBits: Resolver<Maybe<ResolversTypes['StopBits']>, ParentType, ContextType>;
  writeBufferSize: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  writeTimeout: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PortStatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['PortStatus'] = ResolversParentTypes['PortStatus']> = {
  bytesToRead: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  bytesToWrite: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  charactersRead: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  charactersWritten: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  isOpen: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  authenticate: Resolver<ResolversTypes['MakerverseSession'], ParentType, ContextType, RequireFields<QueryAuthenticateArgs, 'token'>>;
  getPort: Resolver<ResolversTypes['SystemPort'], ParentType, ContextType, RequireFields<QueryGetPortArgs, 'portName'>>;
  getSettings: Resolver<ResolversTypes['MakerverseSettings'], ParentType, ContextType>;
  getWorkspace: Resolver<ResolversTypes['WorkspaceSettings'], ParentType, ContextType, RequireFields<QueryGetWorkspaceArgs, 'idOrPath'>>;
  listPorts: Resolver<Array<ResolversTypes['SystemPort']>, ParentType, ContextType>;
  workspace: Resolver<ResolversTypes['WorkspaceSettings'], ParentType, ContextType, RequireFields<QueryWorkspaceArgs, never>>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  onMachineConfiguration: SubscriptionResolver<ResolversTypes['MachineConfiguration'], "onMachineConfiguration", ParentType, ContextType, RequireFields<SubscriptionOnMachineConfigurationArgs, 'portName'>>;
  onMachineSetting: SubscriptionResolver<ResolversTypes['MachineSetting'], "onMachineSetting", ParentType, ContextType, RequireFields<SubscriptionOnMachineSettingArgs, 'portName'>>;
  onMachineState: SubscriptionResolver<ResolversTypes['MachineState'], "onMachineState", ParentType, ContextType, RequireFields<SubscriptionOnMachineStateArgs, 'portName'>>;
  onPortList: SubscriptionResolver<Array<ResolversTypes['SystemPort']>, "onPortList", ParentType, ContextType>;
  onPortStatus: SubscriptionResolver<ResolversTypes['SystemPort'], "onPortStatus", ParentType, ContextType>;
  onWorkspacesChanged: SubscriptionResolver<ResolversTypes['WorkspaceChange'], "onWorkspacesChanged", ParentType, ContextType>;
  openWorkspace: SubscriptionResolver<ResolversTypes['Workspace'], "openWorkspace", ParentType, ContextType, RequireFields<SubscriptionOpenWorkspaceArgs, 'workspaceId'>>;
};

export type SystemPortResolvers<ContextType = any, ParentType extends ResolversParentTypes['SystemPort'] = ResolversParentTypes['SystemPort']> = {
  connection: Resolver<Maybe<ResolversTypes['ConnectedPort']>, ParentType, ContextType>;
  error: Resolver<Maybe<ResolversTypes['PortError']>, ParentType, ContextType>;
  options: Resolver<ResolversTypes['PortOptions'], ParentType, ContextType>;
  portName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  state: Resolver<ResolversTypes['PortState'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WorkspaceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Workspace'] = ResolversParentTypes['Workspace']> = {
  settings: Resolver<ResolversTypes['WorkspaceSettings'], ParentType, ContextType>;
  state: Resolver<ResolversTypes['WorkspaceState'], ParentType, ContextType>;
  workspaceId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WorkspaceChangeResolvers<ContextType = any, ParentType extends ResolversParentTypes['WorkspaceChange'] = ResolversParentTypes['WorkspaceChange']> = {
  workspace: Resolver<Maybe<ResolversTypes['Workspace']>, ParentType, ContextType>;
  workspaceId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WorkspaceSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['WorkspaceSettings'] = ResolversParentTypes['WorkspaceSettings']> = {
  autoReconnect: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  axes: Resolver<Array<ResolversTypes['MachineAxisSettings']>, ParentType, ContextType>;
  bkColor: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  color: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  commands: Resolver<Array<ResolversTypes['MachineCommandSettings']>, ParentType, ContextType>;
  connection: Resolver<ResolversTypes['ConnectionSettings'], ParentType, ContextType>;
  features: Resolver<Array<ResolversTypes['MachineFeatureSettings']>, ParentType, ContextType>;
  icon: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  machineProfileId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  onboarded: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  parts: Resolver<Array<ResolversTypes['MachinePartSettings']>, ParentType, ContextType>;
  path: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  preferImperial: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Decimal'], any> {
  name: 'Decimal';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface LongScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Long'], any> {
  name: 'Long';
}

export type Resolvers<ContextType = any> = {
  AppUpdates: AppUpdatesResolvers<ContextType>;
  CommandSettings: CommandSettingsResolvers<ContextType>;
  ConnectedPort: ConnectedPortResolvers<ContextType>;
  ConnectionSettings: ConnectionSettingsResolvers<ContextType>;
  EventSettings: EventSettingsResolvers<ContextType>;
  FileSystemSettings: FileSystemSettingsResolvers<ContextType>;
  FirmwareRequirement: FirmwareRequirementResolvers<ContextType>;
  Machine: MachineResolvers<ContextType>;
  MachineAlert: MachineAlertResolvers<ContextType>;
  MachineAxisSettings: MachineAxisSettingsResolvers<ContextType>;
  MachineCommandSettings: MachineCommandSettingsResolvers<ContextType>;
  MachineConfiguration: MachineConfigurationResolvers<ContextType>;
  MachineDetectedFirmware: MachineDetectedFirmwareResolvers<ContextType>;
  MachineFeatureSettings: MachineFeatureSettingsResolvers<ContextType>;
  MachineFirmwareSettings: MachineFirmwareSettingsResolvers<ContextType>;
  MachinePartSettings: MachinePartSettingsResolvers<ContextType>;
  MachinePosition: MachinePositionResolvers<ContextType>;
  MachineSetting: MachineSettingResolvers<ContextType>;
  MachineSettingSettings: MachineSettingSettingsResolvers<ContextType>;
  MachineSpecSettings: MachineSpecSettingsResolvers<ContextType>;
  MachineState: MachineStateResolvers<ContextType>;
  MacroSettings: MacroSettingsResolvers<ContextType>;
  MakerHubSettings: MakerHubSettingsResolvers<ContextType>;
  MakerverseSession: MakerverseSessionResolvers<ContextType>;
  MakerverseSettings: MakerverseSettingsResolvers<ContextType>;
  MakerverseUser: MakerverseUserResolvers<ContextType>;
  MountPointSettings: MountPointSettingsResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  PortError: PortErrorResolvers<ContextType>;
  PortOptions: PortOptionsResolvers<ContextType>;
  PortStatus: PortStatusResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  Subscription: SubscriptionResolvers<ContextType>;
  SystemPort: SystemPortResolvers<ContextType>;
  Workspace: WorkspaceResolvers<ContextType>;
  WorkspaceChange: WorkspaceChangeResolvers<ContextType>;
  WorkspaceSettings: WorkspaceSettingsResolvers<ContextType>;
  Decimal: GraphQLScalarType;
  DateTime: GraphQLScalarType;
  Long: GraphQLScalarType;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;

export type AuthenticateQueryVariables = Exact<{
  token: Scalars['String'];
}>;


export type AuthenticateQuery = (
  { __typename?: 'Query' }
  & { session: (
    { __typename?: 'MakerverseSession' }
    & MakerverseSessionFragment
  ) }
);

export type MakerverseSessionFragment = (
  { __typename?: 'MakerverseSession' }
  & Pick<MakerverseSession, 'token'>
  & { user: (
    { __typename?: 'MakerverseUser' }
    & MakerverseUserFullFragment
  ) }
);

export type MakerverseUserMinFragment = (
  { __typename?: 'MakerverseUser' }
  & Pick<MakerverseUser, 'username'>
);

export type MakerverseUserFullFragment = (
  { __typename?: 'MakerverseUser' }
  & Pick<MakerverseUser, 'id' | 'authenticationType' | 'enabled'>
  & MakerverseUserMinFragment
);

export type MachineFragment = (
  { __typename?: 'Machine' }
  & Pick<Machine, 'machineProfileId'>
);

export type DetectedFirmwareFragment = (
  { __typename?: 'MachineDetectedFirmware' }
  & Pick<MachineDetectedFirmware, 'friendlyName' | 'isValid' | 'name' | 'value' | 'edition'>
);

export type MachineConfigFragment = (
  { __typename?: 'MachineConfiguration' }
  & { firmware: (
    { __typename?: 'MachineDetectedFirmware' }
    & DetectedFirmwareFragment
  ) }
);

export type MachineConfigurationSubscriptionVariables = Exact<{
  portName: Scalars['String'];
}>;


export type MachineConfigurationSubscription = (
  { __typename?: 'Subscription' }
  & { config: (
    { __typename?: 'MachineConfiguration' }
    & MachineConfigFragment
  ) }
);

export type FirmwareRequirementFragment = (
  { __typename?: 'FirmwareRequirement' }
  & Pick<FirmwareRequirement, 'controllerType' | 'name' | 'edition' | 'value'>
);

export type ConnectedPortStatusFragment = (
  { __typename?: 'ConnectedPort' }
  & Pick<ConnectedPort, 'friendlyName'>
  & { firmwareRequirement: (
    { __typename?: 'FirmwareRequirement' }
    & FirmwareRequirementFragment
  ), status: (
    { __typename?: 'PortStatus' }
    & PortIoStatusFragment
  ) }
);

export type ConnectedPortFragment = (
  { __typename?: 'ConnectedPort' }
  & { machine: (
    { __typename?: 'Machine' }
    & MachineFragment
  ) }
  & ConnectedPortStatusFragment
);

export type PortIoStatusFragment = (
  { __typename?: 'PortStatus' }
  & Pick<PortStatus, 'bytesToRead' | 'bytesToWrite' | 'charactersRead' | 'charactersWritten'>
);

export type PortOptionsFragment = (
  { __typename?: 'PortOptions' }
  & Pick<PortOptions, 'baudRate' | 'parity' | 'dataBits' | 'stopBits' | 'handshake' | 'readBufferSize' | 'writeBufferSize' | 'rtsEnable' | 'readTimeout' | 'writeTimeout'>
);

export type SystemPortFragment = (
  { __typename?: 'SystemPort' }
  & Pick<SystemPort, 'portName' | 'state'>
  & { error: Maybe<(
    { __typename?: 'PortError' }
    & Pick<PortError, 'name' | 'message'>
  )>, options: (
    { __typename?: 'PortOptions' }
    & PortOptionsFragment
  ), connection: Maybe<(
    { __typename?: 'ConnectedPort' }
    & ConnectedPortFragment
  )> }
);

export type PortStatusFragment = (
  { __typename?: 'SystemPort' }
  & Pick<SystemPort, 'portName' | 'state'>
  & { error: Maybe<(
    { __typename?: 'PortError' }
    & Pick<PortError, 'name' | 'message'>
  )>, connection: Maybe<(
    { __typename?: 'ConnectedPort' }
    & ConnectedPortStatusFragment
  )> }
);

export type ListPortsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListPortsQuery = (
  { __typename?: 'Query' }
  & { ports: Array<(
    { __typename?: 'SystemPort' }
    & PortStatusFragment
  )> }
);

export type PortStatusSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type PortStatusSubscription = (
  { __typename?: 'Subscription' }
  & { port: (
    { __typename?: 'SystemPort' }
    & PortStatusFragment
  ) }
);

export type PortListSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type PortListSubscription = (
  { __typename?: 'Subscription' }
  & { ports: Array<(
    { __typename?: 'SystemPort' }
    & PortStatusFragment
  )> }
);

export type OpenPortMutationVariables = Exact<{
  friendlyName: Scalars['String'];
  portName: Scalars['String'];
  firmware: FirmwareRequirementInput;
  options: SerialPortOptionsInput;
}>;


export type OpenPortMutation = (
  { __typename?: 'Mutation' }
  & { port: (
    { __typename?: 'SystemPort' }
    & SystemPortFragment
  ) }
);

export type ClosePortMutationVariables = Exact<{
  portName: Scalars['String'];
}>;


export type ClosePortMutation = (
  { __typename?: 'Mutation' }
  & { port: (
    { __typename?: 'SystemPort' }
    & PortStatusFragment
  ) }
);

export type EventFragment = (
  { __typename?: 'EventSettings' }
  & Pick<EventSettings, 'id' | 'mtime' | 'enabled' | 'event' | 'trigger' | 'commands'>
);

export type FileSystemFragment = (
  { __typename?: 'FileSystemSettings' }
  & Pick<FileSystemSettings, 'programDirectory'>
  & { mountPoints: Array<(
    { __typename?: 'MountPointSettings' }
    & Pick<MountPointSettings, 'route' | 'target'>
  )> }
);

export type CommandFragment = (
  { __typename?: 'CommandSettings' }
  & Pick<CommandSettings, 'id' | 'mtime' | 'commands' | 'title' | 'enabled'>
);

export type AppUpdatesFragment = (
  { __typename?: 'AppUpdates' }
  & Pick<AppUpdates, 'checkForUpdates' | 'prereleases'>
);

export type MakerHubFragment = (
  { __typename?: 'MakerHubSettings' }
  & Pick<MakerHubSettings, 'enabled'>
);

export type MakerverseEssentialSettingsFragment = (
  { __typename?: 'MakerverseSettings' }
  & { fileSystem: (
    { __typename?: 'FileSystemSettings' }
    & FileSystemFragment
  ), appUpdates: (
    { __typename?: 'AppUpdates' }
    & AppUpdatesFragment
  ), commands: Array<(
    { __typename?: 'CommandSettings' }
    & CommandFragment
  )>, events: Array<(
    { __typename?: 'EventSettings' }
    & EventFragment
  )>, hub: (
    { __typename?: 'MakerHubSettings' }
    & MakerHubFragment
  ), users: Array<(
    { __typename?: 'MakerverseUser' }
    & MakerverseUserFullFragment
  )>, workspaces: Array<(
    { __typename?: 'WorkspaceSettings' }
    & WorkspaceEssentialSettingsFragment
  )> }
);

export type StartupQueryVariables = Exact<{
  token: Scalars['String'];
}>;


export type StartupQuery = (
  { __typename?: 'Query' }
  & { session: (
    { __typename?: 'MakerverseSession' }
    & MakerverseSessionFragment
  ), settings: (
    { __typename?: 'MakerverseSettings' }
    & MakerverseEssentialSettingsFragment
  ) }
);

export type MachineAxisFragment = (
  { __typename?: 'MachineAxisSettings' }
  & Pick<MachineAxisSettings, 'id' | 'name' | 'min' | 'max' | 'precision' | 'accuracy'>
);

export type MachineCommandFragment = (
  { __typename?: 'MachineCommandSettings' }
  & Pick<MachineCommandSettings, 'id' | 'name' | 'value'>
);

export type MachineConnectionFragment = (
  { __typename?: 'ConnectionSettings' }
  & Pick<ConnectionSettings, 'portName' | 'manufacturer'>
  & { firmware: (
    { __typename?: 'MachineFirmwareSettings' }
    & MachineFirmwareFragment
  ) }
);

export type MachineFeatureFragment = (
  { __typename?: 'MachineFeatureSettings' }
  & Pick<MachineFeatureSettings, 'id' | 'disabled' | 'key' | 'title' | 'description' | 'icon'>
);

export type MachineFirmwareFragment = (
  { __typename?: 'MachineFirmwareSettings' }
  & Pick<MachineFirmwareSettings, 'id' | 'controllerType' | 'baudRateValue' | 'name' | 'edition' | 'rtscts' | 'requiredVersion' | 'suggestedVersion' | 'downloadUrl' | 'helpUrl'>
);

export type MachinePartFragment = (
  { __typename?: 'MachinePartSettings' }
  & Pick<MachinePartSettings, 'id' | 'partType' | 'title' | 'description' | 'optional' | 'isDefault' | 'dataBlob'>
  & { settings: Array<(
    { __typename?: 'MachineSettingSettings' }
    & MachineSettingsFragment
  )>, specs: Array<(
    { __typename?: 'MachineSpecSettings' }
    & MachineSpecFragment
  )> }
);

export type MachineSettingsFragment = (
  { __typename?: 'MachineSettingSettings' }
  & Pick<MachineSettingSettings, 'id' | 'title' | 'settingType' | 'key' | 'value'>
);

export type MachineSpecFragment = (
  { __typename?: 'MachineSpecSettings' }
  & Pick<MachineSpecSettings, 'id' | 'specType' | 'value'>
);

export type WorkspaceQueryVariables = Exact<{
  idOrPath: Scalars['String'];
}>;


export type WorkspaceQuery = (
  { __typename?: 'Query' }
  & { workspace: (
    { __typename?: 'WorkspaceSettings' }
    & WorkspaceFullSettingsFragment
  ) }
);

export type CreateWorkspaceMutationVariables = Exact<{
  workspaceSettings: WorkspaceSettingsInput;
}>;


export type CreateWorkspaceMutation = (
  { __typename?: 'Mutation' }
  & { workspace: (
    { __typename?: 'WorkspaceSettings' }
    & WorkspaceFullSettingsFragment
  ) }
);

export type WorkspaceChangeSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type WorkspaceChangeSubscription = (
  { __typename?: 'Subscription' }
  & { change: (
    { __typename?: 'WorkspaceChange' }
    & Pick<WorkspaceChange, 'workspaceId'>
    & { workspace: Maybe<(
      { __typename?: 'Workspace' }
      & { settings: (
        { __typename?: 'WorkspaceSettings' }
        & WorkspaceFullSettingsFragment
      ) }
    )> }
  ) }
);

export type WorkspacePropsFragment = (
  { __typename?: 'WorkspaceSettings' }
  & Pick<WorkspaceSettings, 'id' | 'machineProfileId' | 'name' | 'onboarded' | 'path' | 'color' | 'bkColor' | 'icon' | 'autoReconnect' | 'preferImperial'>
);

export type WorkspaceFullSettingsFragment = (
  { __typename?: 'WorkspaceSettings' }
  & { connection: (
    { __typename?: 'ConnectionSettings' }
    & MachineConnectionFragment
  ), axes: Array<(
    { __typename?: 'MachineAxisSettings' }
    & MachineAxisFragment
  )>, features: Array<(
    { __typename?: 'MachineFeatureSettings' }
    & MachineFeatureFragment
  )>, commands: Array<(
    { __typename?: 'MachineCommandSettings' }
    & MachineCommandFragment
  )>, parts: Array<(
    { __typename?: 'MachinePartSettings' }
    & MachinePartFragment
  )> }
  & WorkspacePropsFragment
);

export type WorkspaceEssentialSettingsFragment = (
  { __typename?: 'WorkspaceSettings' }
  & WorkspaceFullSettingsFragment
);

export const MakerverseUserMinFragmentDoc = gql`
    fragment MakerverseUserMin on MakerverseUser {
  username
}
    `;
export const MakerverseUserFullFragmentDoc = gql`
    fragment MakerverseUserFull on MakerverseUser {
  ...MakerverseUserMin
  id
  authenticationType
  enabled
}
    ${MakerverseUserMinFragmentDoc}`;
export const MakerverseSessionFragmentDoc = gql`
    fragment MakerverseSession on MakerverseSession {
  token
  user {
    ...MakerverseUserFull
  }
}
    ${MakerverseUserFullFragmentDoc}`;
export const DetectedFirmwareFragmentDoc = gql`
    fragment DetectedFirmware on MachineDetectedFirmware {
  friendlyName
  isValid
  name
  value
  edition
}
    `;
export const MachineConfigFragmentDoc = gql`
    fragment MachineConfig on MachineConfiguration {
  firmware {
    ...DetectedFirmware
  }
}
    ${DetectedFirmwareFragmentDoc}`;
export const PortOptionsFragmentDoc = gql`
    fragment PortOptions on PortOptions {
  baudRate
  parity
  dataBits
  stopBits
  handshake
  readBufferSize
  writeBufferSize
  rtsEnable
  readTimeout
  writeTimeout
}
    `;
export const FirmwareRequirementFragmentDoc = gql`
    fragment FirmwareRequirement on FirmwareRequirement {
  controllerType
  name
  edition
  value
}
    `;
export const PortIoStatusFragmentDoc = gql`
    fragment PortIOStatus on PortStatus {
  bytesToRead
  bytesToWrite
  charactersRead
  charactersWritten
}
    `;
export const ConnectedPortStatusFragmentDoc = gql`
    fragment ConnectedPortStatus on ConnectedPort {
  friendlyName
  firmwareRequirement {
    ...FirmwareRequirement
  }
  status {
    ...PortIOStatus
  }
}
    ${FirmwareRequirementFragmentDoc}
${PortIoStatusFragmentDoc}`;
export const MachineFragmentDoc = gql`
    fragment Machine on Machine {
  machineProfileId
}
    `;
export const ConnectedPortFragmentDoc = gql`
    fragment ConnectedPort on ConnectedPort {
  ...ConnectedPortStatus
  machine {
    ...Machine
  }
}
    ${ConnectedPortStatusFragmentDoc}
${MachineFragmentDoc}`;
export const SystemPortFragmentDoc = gql`
    fragment SystemPort on SystemPort {
  portName
  state
  error {
    name
    message
  }
  options {
    ...PortOptions
  }
  connection {
    ...ConnectedPort
  }
}
    ${PortOptionsFragmentDoc}
${ConnectedPortFragmentDoc}`;
export const PortStatusFragmentDoc = gql`
    fragment PortStatus on SystemPort {
  portName
  state
  error {
    name
    message
  }
  connection {
    ...ConnectedPortStatus
  }
}
    ${ConnectedPortStatusFragmentDoc}`;
export const FileSystemFragmentDoc = gql`
    fragment FileSystem on FileSystemSettings {
  programDirectory
  mountPoints {
    route
    target
  }
}
    `;
export const AppUpdatesFragmentDoc = gql`
    fragment AppUpdates on AppUpdates {
  checkForUpdates
  prereleases
}
    `;
export const CommandFragmentDoc = gql`
    fragment Command on CommandSettings {
  id
  mtime
  commands
  title
  enabled
}
    `;
export const EventFragmentDoc = gql`
    fragment Event on EventSettings {
  id
  mtime
  enabled
  event
  trigger
  commands
}
    `;
export const MakerHubFragmentDoc = gql`
    fragment MakerHub on MakerHubSettings {
  enabled
}
    `;
export const WorkspacePropsFragmentDoc = gql`
    fragment WorkspaceProps on WorkspaceSettings {
  id
  machineProfileId
  name
  onboarded
  path
  color
  bkColor
  icon
  autoReconnect
  preferImperial
}
    `;
export const MachineFirmwareFragmentDoc = gql`
    fragment MachineFirmware on MachineFirmwareSettings {
  id
  controllerType
  baudRateValue
  name
  edition
  rtscts
  requiredVersion
  suggestedVersion
  downloadUrl
  helpUrl
}
    `;
export const MachineConnectionFragmentDoc = gql`
    fragment MachineConnection on ConnectionSettings {
  portName
  manufacturer
  firmware {
    ...MachineFirmware
  }
}
    ${MachineFirmwareFragmentDoc}`;
export const MachineAxisFragmentDoc = gql`
    fragment MachineAxis on MachineAxisSettings {
  id
  name
  min
  max
  precision
  accuracy
}
    `;
export const MachineFeatureFragmentDoc = gql`
    fragment MachineFeature on MachineFeatureSettings {
  id
  disabled
  key
  title
  description
  icon
}
    `;
export const MachineCommandFragmentDoc = gql`
    fragment MachineCommand on MachineCommandSettings {
  id
  name
  value
}
    `;
export const MachineSettingsFragmentDoc = gql`
    fragment MachineSettings on MachineSettingSettings {
  id
  title
  settingType
  key
  value
}
    `;
export const MachineSpecFragmentDoc = gql`
    fragment MachineSpec on MachineSpecSettings {
  id
  specType
  value
}
    `;
export const MachinePartFragmentDoc = gql`
    fragment MachinePart on MachinePartSettings {
  id
  partType
  title
  description
  optional
  isDefault
  dataBlob
  settings {
    ...MachineSettings
  }
  specs {
    ...MachineSpec
  }
}
    ${MachineSettingsFragmentDoc}
${MachineSpecFragmentDoc}`;
export const WorkspaceFullSettingsFragmentDoc = gql`
    fragment WorkspaceFullSettings on WorkspaceSettings {
  ...WorkspaceProps
  connection {
    ...MachineConnection
  }
  axes {
    ...MachineAxis
  }
  features {
    ...MachineFeature
  }
  commands {
    ...MachineCommand
  }
  parts {
    ...MachinePart
  }
}
    ${WorkspacePropsFragmentDoc}
${MachineConnectionFragmentDoc}
${MachineAxisFragmentDoc}
${MachineFeatureFragmentDoc}
${MachineCommandFragmentDoc}
${MachinePartFragmentDoc}`;
export const WorkspaceEssentialSettingsFragmentDoc = gql`
    fragment WorkspaceEssentialSettings on WorkspaceSettings {
  ...WorkspaceFullSettings
}
    ${WorkspaceFullSettingsFragmentDoc}`;
export const MakerverseEssentialSettingsFragmentDoc = gql`
    fragment MakerverseEssentialSettings on MakerverseSettings {
  fileSystem {
    ...FileSystem
  }
  appUpdates {
    ...AppUpdates
  }
  commands {
    ...Command
  }
  events {
    ...Event
  }
  hub {
    ...MakerHub
  }
  users {
    ...MakerverseUserFull
  }
  workspaces {
    ...WorkspaceEssentialSettings
  }
}
    ${FileSystemFragmentDoc}
${AppUpdatesFragmentDoc}
${CommandFragmentDoc}
${EventFragmentDoc}
${MakerHubFragmentDoc}
${MakerverseUserFullFragmentDoc}
${WorkspaceEssentialSettingsFragmentDoc}`;
export const AuthenticateDocument = gql`
    query Authenticate($token: String!) {
  session: authenticate(token: $token) {
    ...MakerverseSession
  }
}
    ${MakerverseSessionFragmentDoc}`;

/**
 * __useAuthenticateQuery__
 *
 * To run a query within a React component, call `useAuthenticateQuery` and pass it any options that fit your needs.
 * When your component renders, `useAuthenticateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAuthenticateQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useAuthenticateQuery(baseOptions: Apollo.QueryHookOptions<AuthenticateQuery, AuthenticateQueryVariables>) {
        return Apollo.useQuery<AuthenticateQuery, AuthenticateQueryVariables>(AuthenticateDocument, baseOptions);
      }
export function useAuthenticateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AuthenticateQuery, AuthenticateQueryVariables>) {
          return Apollo.useLazyQuery<AuthenticateQuery, AuthenticateQueryVariables>(AuthenticateDocument, baseOptions);
        }
export type AuthenticateQueryHookResult = ReturnType<typeof useAuthenticateQuery>;
export type AuthenticateLazyQueryHookResult = ReturnType<typeof useAuthenticateLazyQuery>;
export type AuthenticateQueryResult = Apollo.QueryResult<AuthenticateQuery, AuthenticateQueryVariables>;
export const MachineConfigurationDocument = gql`
    subscription MachineConfiguration($portName: String!) {
  config: onMachineConfiguration(portName: $portName) {
    ...MachineConfig
  }
}
    ${MachineConfigFragmentDoc}`;

/**
 * __useMachineConfigurationSubscription__
 *
 * To run a query within a React component, call `useMachineConfigurationSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMachineConfigurationSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMachineConfigurationSubscription({
 *   variables: {
 *      portName: // value for 'portName'
 *   },
 * });
 */
export function useMachineConfigurationSubscription(baseOptions: Apollo.SubscriptionHookOptions<MachineConfigurationSubscription, MachineConfigurationSubscriptionVariables>) {
        return Apollo.useSubscription<MachineConfigurationSubscription, MachineConfigurationSubscriptionVariables>(MachineConfigurationDocument, baseOptions);
      }
export type MachineConfigurationSubscriptionHookResult = ReturnType<typeof useMachineConfigurationSubscription>;
export type MachineConfigurationSubscriptionResult = Apollo.SubscriptionResult<MachineConfigurationSubscription>;
export const ListPortsDocument = gql`
    query ListPorts {
  ports: listPorts {
    ...PortStatus
  }
}
    ${PortStatusFragmentDoc}`;

/**
 * __useListPortsQuery__
 *
 * To run a query within a React component, call `useListPortsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListPortsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListPortsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListPortsQuery(baseOptions?: Apollo.QueryHookOptions<ListPortsQuery, ListPortsQueryVariables>) {
        return Apollo.useQuery<ListPortsQuery, ListPortsQueryVariables>(ListPortsDocument, baseOptions);
      }
export function useListPortsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListPortsQuery, ListPortsQueryVariables>) {
          return Apollo.useLazyQuery<ListPortsQuery, ListPortsQueryVariables>(ListPortsDocument, baseOptions);
        }
export type ListPortsQueryHookResult = ReturnType<typeof useListPortsQuery>;
export type ListPortsLazyQueryHookResult = ReturnType<typeof useListPortsLazyQuery>;
export type ListPortsQueryResult = Apollo.QueryResult<ListPortsQuery, ListPortsQueryVariables>;
export const PortStatusDocument = gql`
    subscription PortStatus {
  port: onPortStatus {
    ...PortStatus
  }
}
    ${PortStatusFragmentDoc}`;

/**
 * __usePortStatusSubscription__
 *
 * To run a query within a React component, call `usePortStatusSubscription` and pass it any options that fit your needs.
 * When your component renders, `usePortStatusSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePortStatusSubscription({
 *   variables: {
 *   },
 * });
 */
export function usePortStatusSubscription(baseOptions?: Apollo.SubscriptionHookOptions<PortStatusSubscription, PortStatusSubscriptionVariables>) {
        return Apollo.useSubscription<PortStatusSubscription, PortStatusSubscriptionVariables>(PortStatusDocument, baseOptions);
      }
export type PortStatusSubscriptionHookResult = ReturnType<typeof usePortStatusSubscription>;
export type PortStatusSubscriptionResult = Apollo.SubscriptionResult<PortStatusSubscription>;
export const PortListDocument = gql`
    subscription PortList {
  ports: onPortList {
    ...PortStatus
  }
}
    ${PortStatusFragmentDoc}`;

/**
 * __usePortListSubscription__
 *
 * To run a query within a React component, call `usePortListSubscription` and pass it any options that fit your needs.
 * When your component renders, `usePortListSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePortListSubscription({
 *   variables: {
 *   },
 * });
 */
export function usePortListSubscription(baseOptions?: Apollo.SubscriptionHookOptions<PortListSubscription, PortListSubscriptionVariables>) {
        return Apollo.useSubscription<PortListSubscription, PortListSubscriptionVariables>(PortListDocument, baseOptions);
      }
export type PortListSubscriptionHookResult = ReturnType<typeof usePortListSubscription>;
export type PortListSubscriptionResult = Apollo.SubscriptionResult<PortListSubscription>;
export const OpenPortDocument = gql`
    mutation OpenPort($friendlyName: String!, $portName: String!, $firmware: FirmwareRequirementInput!, $options: SerialPortOptionsInput!) {
  port: openPort(
    friendlyName: $friendlyName
    portName: $portName
    firmware: $firmware
    options: $options
  ) {
    ...SystemPort
  }
}
    ${SystemPortFragmentDoc}`;
export type OpenPortMutationFn = Apollo.MutationFunction<OpenPortMutation, OpenPortMutationVariables>;

/**
 * __useOpenPortMutation__
 *
 * To run a mutation, you first call `useOpenPortMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOpenPortMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [openPortMutation, { data, loading, error }] = useOpenPortMutation({
 *   variables: {
 *      friendlyName: // value for 'friendlyName'
 *      portName: // value for 'portName'
 *      firmware: // value for 'firmware'
 *      options: // value for 'options'
 *   },
 * });
 */
export function useOpenPortMutation(baseOptions?: Apollo.MutationHookOptions<OpenPortMutation, OpenPortMutationVariables>) {
        return Apollo.useMutation<OpenPortMutation, OpenPortMutationVariables>(OpenPortDocument, baseOptions);
      }
export type OpenPortMutationHookResult = ReturnType<typeof useOpenPortMutation>;
export type OpenPortMutationResult = Apollo.MutationResult<OpenPortMutation>;
export type OpenPortMutationOptions = Apollo.BaseMutationOptions<OpenPortMutation, OpenPortMutationVariables>;
export const ClosePortDocument = gql`
    mutation ClosePort($portName: String!) {
  port: closePort(portName: $portName) {
    ...PortStatus
  }
}
    ${PortStatusFragmentDoc}`;
export type ClosePortMutationFn = Apollo.MutationFunction<ClosePortMutation, ClosePortMutationVariables>;

/**
 * __useClosePortMutation__
 *
 * To run a mutation, you first call `useClosePortMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClosePortMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [closePortMutation, { data, loading, error }] = useClosePortMutation({
 *   variables: {
 *      portName: // value for 'portName'
 *   },
 * });
 */
export function useClosePortMutation(baseOptions?: Apollo.MutationHookOptions<ClosePortMutation, ClosePortMutationVariables>) {
        return Apollo.useMutation<ClosePortMutation, ClosePortMutationVariables>(ClosePortDocument, baseOptions);
      }
export type ClosePortMutationHookResult = ReturnType<typeof useClosePortMutation>;
export type ClosePortMutationResult = Apollo.MutationResult<ClosePortMutation>;
export type ClosePortMutationOptions = Apollo.BaseMutationOptions<ClosePortMutation, ClosePortMutationVariables>;
export const StartupDocument = gql`
    query Startup($token: String!) {
  session: authenticate(token: $token) {
    ...MakerverseSession
  }
  settings: getSettings {
    ...MakerverseEssentialSettings
  }
}
    ${MakerverseSessionFragmentDoc}
${MakerverseEssentialSettingsFragmentDoc}`;

/**
 * __useStartupQuery__
 *
 * To run a query within a React component, call `useStartupQuery` and pass it any options that fit your needs.
 * When your component renders, `useStartupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStartupQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useStartupQuery(baseOptions: Apollo.QueryHookOptions<StartupQuery, StartupQueryVariables>) {
        return Apollo.useQuery<StartupQuery, StartupQueryVariables>(StartupDocument, baseOptions);
      }
export function useStartupLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StartupQuery, StartupQueryVariables>) {
          return Apollo.useLazyQuery<StartupQuery, StartupQueryVariables>(StartupDocument, baseOptions);
        }
export type StartupQueryHookResult = ReturnType<typeof useStartupQuery>;
export type StartupLazyQueryHookResult = ReturnType<typeof useStartupLazyQuery>;
export type StartupQueryResult = Apollo.QueryResult<StartupQuery, StartupQueryVariables>;
export const WorkspaceDocument = gql`
    query Workspace($idOrPath: String!) {
  workspace: getWorkspace(idOrPath: $idOrPath) {
    ...WorkspaceFullSettings
  }
}
    ${WorkspaceFullSettingsFragmentDoc}`;

/**
 * __useWorkspaceQuery__
 *
 * To run a query within a React component, call `useWorkspaceQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceQuery({
 *   variables: {
 *      idOrPath: // value for 'idOrPath'
 *   },
 * });
 */
export function useWorkspaceQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceQuery, WorkspaceQueryVariables>) {
        return Apollo.useQuery<WorkspaceQuery, WorkspaceQueryVariables>(WorkspaceDocument, baseOptions);
      }
export function useWorkspaceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceQuery, WorkspaceQueryVariables>) {
          return Apollo.useLazyQuery<WorkspaceQuery, WorkspaceQueryVariables>(WorkspaceDocument, baseOptions);
        }
export type WorkspaceQueryHookResult = ReturnType<typeof useWorkspaceQuery>;
export type WorkspaceLazyQueryHookResult = ReturnType<typeof useWorkspaceLazyQuery>;
export type WorkspaceQueryResult = Apollo.QueryResult<WorkspaceQuery, WorkspaceQueryVariables>;
export const CreateWorkspaceDocument = gql`
    mutation CreateWorkspace($workspaceSettings: WorkspaceSettingsInput!) {
  workspace: createWorkspace(workspaceSettings: $workspaceSettings) {
    ...WorkspaceFullSettings
  }
}
    ${WorkspaceFullSettingsFragmentDoc}`;
export type CreateWorkspaceMutationFn = Apollo.MutationFunction<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>;

/**
 * __useCreateWorkspaceMutation__
 *
 * To run a mutation, you first call `useCreateWorkspaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateWorkspaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createWorkspaceMutation, { data, loading, error }] = useCreateWorkspaceMutation({
 *   variables: {
 *      workspaceSettings: // value for 'workspaceSettings'
 *   },
 * });
 */
export function useCreateWorkspaceMutation(baseOptions?: Apollo.MutationHookOptions<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>) {
        return Apollo.useMutation<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>(CreateWorkspaceDocument, baseOptions);
      }
export type CreateWorkspaceMutationHookResult = ReturnType<typeof useCreateWorkspaceMutation>;
export type CreateWorkspaceMutationResult = Apollo.MutationResult<CreateWorkspaceMutation>;
export type CreateWorkspaceMutationOptions = Apollo.BaseMutationOptions<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>;
export const WorkspaceChangeDocument = gql`
    subscription WorkspaceChange {
  change: onWorkspacesChanged {
    workspaceId
    workspace {
      settings {
        ...WorkspaceFullSettings
      }
    }
  }
}
    ${WorkspaceFullSettingsFragmentDoc}`;

/**
 * __useWorkspaceChangeSubscription__
 *
 * To run a query within a React component, call `useWorkspaceChangeSubscription` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceChangeSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceChangeSubscription({
 *   variables: {
 *   },
 * });
 */
export function useWorkspaceChangeSubscription(baseOptions?: Apollo.SubscriptionHookOptions<WorkspaceChangeSubscription, WorkspaceChangeSubscriptionVariables>) {
        return Apollo.useSubscription<WorkspaceChangeSubscription, WorkspaceChangeSubscriptionVariables>(WorkspaceChangeDocument, baseOptions);
      }
export type WorkspaceChangeSubscriptionHookResult = ReturnType<typeof useWorkspaceChangeSubscription>;
export type WorkspaceChangeSubscriptionResult = Apollo.SubscriptionResult<WorkspaceChangeSubscription>;