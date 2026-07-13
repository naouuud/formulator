/*
 * Public API surface of @formulator/schema
 *
 * The Spread document model (framework-agnostic, no Angular dependency)
 * plus wire (de)serialization helpers shared by every consumer.
 */

export * from './lib/rich-text';
export * from './lib/validators';
export * from './lib/option';
export * from './lib/note';
export * from './lib/question';
export * from './lib/element';
export * from './lib/page';
export * from './lib/spread';
export * from './lib/tod';

// Wire (de)serialization
export * from './lib/wire/spread.dto';
export * from './lib/wire/spread.mapper';
