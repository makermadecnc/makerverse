import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Long` scalar type represents non-fractional signed whole 64-bit numeric values. Long can represent values between -(2^63) and 2^63 - 1. */
  Long: any;
  /** The built-in `Decimal` scalar type. */
  Decimal: any;
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

export type ConnectionSettings = {
  __typename?: 'ConnectionSettings';
  firmware: MachineFirmwareSettings;
  manufacturer: Maybe<Scalars['String']>;
  port: Scalars['String'];
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
  baudRate: BaudRate;
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
  dataBlob: Maybe<Scalars['String']>;
  description: Maybe<Scalars['String']>;
  id: Maybe<Scalars['String']>;
  isDefault: Scalars['Boolean'];
  optional: Scalars['Boolean'];
  partType: MachinePartType;
  settings: Array<MachineSettingSettings>;
  specs: Array<MachineSpecSettings>;
  title: Scalars['String'];
};

export type MachineSettingSettings = {
  __typename?: 'MachineSettingSettings';
  id: Scalars['String'];
  key: Scalars['String'];
  settingType: MachineSettingType;
  title: Scalars['String'];
  value: Scalars['String'];
};

export type MachineSpecSettings = {
  __typename?: 'MachineSpecSettings';
  id: Scalars['String'];
  specType: MachineSpecType;
  value: Scalars['Decimal'];
};

export type MacroSettings = {
  __typename?: 'MacroSettings';
  content: Scalars['String'];
  id: Scalars['String'];
  mtime: Scalars['Long'];
  name: Scalars['String'];
};

export type MakerverseSettings = {
  __typename?: 'MakerverseSettings';
  appUpdates: AppUpdates;
  commands: Array<CommandSettings>;
  events: Array<EventSettings>;
  fileSystem: FileSystemSettings;
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

export type Query = {
  __typename?: 'Query';
  authenticate: MakerverseUser;
  settings: Maybe<MakerverseSettings>;
};


export type QueryAuthenticateArgs = {
  token: Scalars['String'];
};

export type WorkspaceSettings = {
  __typename?: 'WorkspaceSettings';
  autoReconnect: Scalars['Boolean'];
  axes: Array<MachineAxisSettings>;
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

export enum MachineControllerType {
  Grbl = 'GRBL',
  Marlin = 'MARLIN',
  Maslow = 'MASLOW',
  Smoothie = 'SMOOTHIE',
  TinyG = 'TINY_G'
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
  ConnectionSettings: ResolverTypeWrapper<ConnectionSettings>;
  EventSettings: ResolverTypeWrapper<EventSettings>;
  FileSystemSettings: ResolverTypeWrapper<FileSystemSettings>;
  MachineAxisSettings: ResolverTypeWrapper<MachineAxisSettings>;
  MachineCommandSettings: ResolverTypeWrapper<MachineCommandSettings>;
  MachineFeatureSettings: ResolverTypeWrapper<MachineFeatureSettings>;
  MachineFirmwareSettings: ResolverTypeWrapper<MachineFirmwareSettings>;
  MachinePartSettings: ResolverTypeWrapper<MachinePartSettings>;
  MachineSettingSettings: ResolverTypeWrapper<MachineSettingSettings>;
  MachineSpecSettings: ResolverTypeWrapper<MachineSpecSettings>;
  MacroSettings: ResolverTypeWrapper<MacroSettings>;
  MakerverseSettings: ResolverTypeWrapper<MakerverseSettings>;
  MakerverseUser: ResolverTypeWrapper<MakerverseUser>;
  MountPointSettings: ResolverTypeWrapper<MountPointSettings>;
  Query: ResolverTypeWrapper<{}>;
  WorkspaceSettings: ResolverTypeWrapper<WorkspaceSettings>;
  AxisName: AxisName;
  BaudRate: BaudRate;
  MachineControllerType: MachineControllerType;
  MachinePartType: MachinePartType;
  MachineSettingType: MachineSettingType;
  MachineSpecType: MachineSpecType;
  Long: ResolverTypeWrapper<Scalars['Long']>;
  Decimal: ResolverTypeWrapper<Scalars['Decimal']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AppUpdates: AppUpdates;
  Boolean: Scalars['Boolean'];
  CommandSettings: CommandSettings;
  String: Scalars['String'];
  ConnectionSettings: ConnectionSettings;
  EventSettings: EventSettings;
  FileSystemSettings: FileSystemSettings;
  MachineAxisSettings: MachineAxisSettings;
  MachineCommandSettings: MachineCommandSettings;
  MachineFeatureSettings: MachineFeatureSettings;
  MachineFirmwareSettings: MachineFirmwareSettings;
  MachinePartSettings: MachinePartSettings;
  MachineSettingSettings: MachineSettingSettings;
  MachineSpecSettings: MachineSpecSettings;
  MacroSettings: MacroSettings;
  MakerverseSettings: MakerverseSettings;
  MakerverseUser: MakerverseUser;
  MountPointSettings: MountPointSettings;
  Query: {};
  WorkspaceSettings: WorkspaceSettings;
  Long: Scalars['Long'];
  Decimal: Scalars['Decimal'];
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

export type ConnectionSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['ConnectionSettings'] = ResolversParentTypes['ConnectionSettings']> = {
  firmware: Resolver<ResolversTypes['MachineFirmwareSettings'], ParentType, ContextType>;
  manufacturer: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  port: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  baudRate: Resolver<ResolversTypes['BaudRate'], ParentType, ContextType>;
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
  dataBlob: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isDefault: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  optional: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  partType: Resolver<ResolversTypes['MachinePartType'], ParentType, ContextType>;
  settings: Resolver<Array<ResolversTypes['MachineSettingSettings']>, ParentType, ContextType>;
  specs: Resolver<Array<ResolversTypes['MachineSpecSettings']>, ParentType, ContextType>;
  title: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MachineSettingSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MachineSettingSettings'] = ResolversParentTypes['MachineSettingSettings']> = {
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  key: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  settingType: Resolver<ResolversTypes['MachineSettingType'], ParentType, ContextType>;
  title: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MachineSpecSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MachineSpecSettings'] = ResolversParentTypes['MachineSpecSettings']> = {
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  specType: Resolver<ResolversTypes['MachineSpecType'], ParentType, ContextType>;
  value: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MacroSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MacroSettings'] = ResolversParentTypes['MacroSettings']> = {
  content: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mtime: Resolver<ResolversTypes['Long'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MakerverseSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MakerverseSettings'] = ResolversParentTypes['MakerverseSettings']> = {
  appUpdates: Resolver<ResolversTypes['AppUpdates'], ParentType, ContextType>;
  commands: Resolver<Array<ResolversTypes['CommandSettings']>, ParentType, ContextType>;
  events: Resolver<Array<ResolversTypes['EventSettings']>, ParentType, ContextType>;
  fileSystem: Resolver<ResolversTypes['FileSystemSettings'], ParentType, ContextType>;
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

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  authenticate: Resolver<ResolversTypes['MakerverseUser'], ParentType, ContextType, RequireFields<QueryAuthenticateArgs, 'token'>>;
  settings: Resolver<Maybe<ResolversTypes['MakerverseSettings']>, ParentType, ContextType>;
};

export type WorkspaceSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['WorkspaceSettings'] = ResolversParentTypes['WorkspaceSettings']> = {
  autoReconnect: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  axes: Resolver<Array<ResolversTypes['MachineAxisSettings']>, ParentType, ContextType>;
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

export interface LongScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Long'], any> {
  name: 'Long';
}

export interface DecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Decimal'], any> {
  name: 'Decimal';
}

export type Resolvers<ContextType = any> = {
  AppUpdates: AppUpdatesResolvers<ContextType>;
  CommandSettings: CommandSettingsResolvers<ContextType>;
  ConnectionSettings: ConnectionSettingsResolvers<ContextType>;
  EventSettings: EventSettingsResolvers<ContextType>;
  FileSystemSettings: FileSystemSettingsResolvers<ContextType>;
  MachineAxisSettings: MachineAxisSettingsResolvers<ContextType>;
  MachineCommandSettings: MachineCommandSettingsResolvers<ContextType>;
  MachineFeatureSettings: MachineFeatureSettingsResolvers<ContextType>;
  MachineFirmwareSettings: MachineFirmwareSettingsResolvers<ContextType>;
  MachinePartSettings: MachinePartSettingsResolvers<ContextType>;
  MachineSettingSettings: MachineSettingSettingsResolvers<ContextType>;
  MachineSpecSettings: MachineSpecSettingsResolvers<ContextType>;
  MacroSettings: MacroSettingsResolvers<ContextType>;
  MakerverseSettings: MakerverseSettingsResolvers<ContextType>;
  MakerverseUser: MakerverseUserResolvers<ContextType>;
  MountPointSettings: MountPointSettingsResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  WorkspaceSettings: WorkspaceSettingsResolvers<ContextType>;
  Long: GraphQLScalarType;
  Decimal: GraphQLScalarType;
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
  & { makerverseUser: (
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
  & Pick<MakerverseUser, 'id' | 'authenticationType' | 'enabled' | 'tokens'>
  & MakerverseUserMinFragment
);

export type CommandFragment = (
  { __typename?: 'CommandSettings' }
  & Pick<CommandSettings, 'id' | 'mtime' | 'enabled' | 'title' | 'commands'>
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

export type MakerverseSettingsStartupFragment = (
  { __typename?: 'MakerverseSettings' }
  & { fileSystem: (
    { __typename?: 'FileSystemSettings' }
    & FileSystemFragment
  ), appUpdates: (
    { __typename?: 'AppUpdates' }
    & Pick<AppUpdates, 'checkForUpdates' | 'prereleases'>
  ), commands: Array<(
    { __typename?: 'CommandSettings' }
    & CommandFragment
  )>, events: Array<(
    { __typename?: 'EventSettings' }
    & EventFragment
  )>, macros: Array<(
    { __typename?: 'MacroSettings' }
    & Pick<MacroSettings, 'id' | 'mtime' | 'name' | 'content'>
  )>, users: Array<(
    { __typename?: 'MakerverseUser' }
    & MakerverseUserFullFragment
  )> }
);

export const FileSystemFragmentDoc = gql`
    fragment FileSystem on FileSystemSettings {
  programDirectory
  mountPoints {
    route
    target
  }
}
    `;
export const CommandFragmentDoc = gql`
    fragment Command on CommandSettings {
  id
  mtime
  enabled
  title
  commands
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
  tokens
}
    ${MakerverseUserMinFragmentDoc}`;
export const MakerverseSettingsStartupFragmentDoc = gql`
    fragment MakerverseSettingsStartup on MakerverseSettings {
  fileSystem {
    ...FileSystem
  }
  appUpdates {
    checkForUpdates
    prereleases
  }
  commands {
    ...Command
  }
  events {
    ...Event
  }
  macros {
    id
    mtime
    name
    content
  }
  users {
    ...MakerverseUserFull
  }
}
    ${FileSystemFragmentDoc}
${CommandFragmentDoc}
${EventFragmentDoc}
${MakerverseUserFullFragmentDoc}`;
export const AuthenticateDocument = gql`
    query Authenticate($token: String!) {
  makerverseUser: authenticate(token: $token) {
    ...MakerverseUserFull
  }
}
    ${MakerverseUserFullFragmentDoc}`;

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