# @cloudnouns/factory

`@cloudnouns/factory` is a small JavaScript library for creating SVG images from Run-length encoded (RLE) data. The library is written in TypeScript and based on the work of the [Nouns DAO](https://github.com/nounsDAO/nouns-monorepo) and the greater Nouns ecosystem.

## Installation

The library can be installed with your preferred package manager:

```bash
# npm
npm install @cloudnouns/factory

# yarn
yarn add @cloudnouns/factory
```

## Basic usage

First, initialize a new factory from an RLE image data file. [See example files here](/data).

```js
import { Factory } from "@cloudnouns/factory";
import ImageData from "path/to/config/file";

const factory = new Factory(ImageData);

// create random item
const item = factory.createItem();

// create item from seed
const item2 = factory.createItemFromSeed({
  /* seed properties */
});
```

## Examples

The library is framework agnostic and has been test in React, Svelte, Vue, and vanilla JS environments. The following examples are in React and use the [Nouns configuration file](/data/nouns.json).

Random Noun:

```jsx
import { Factory } from "@cloudnouns/factory";
import ImageData from "./nouns.json";

export const Noun = () => {
  const factory = new Factory(ImageData);
  const noun = factory.createItem();

  return <img src={noun.dataUrl} alt='noun' />;
};
```

Partially random Noun:

```jsx
// noun component
import { Factory } from "@cloudnouns/factory";
import ImageData from "./nouns.json";

export default Noun = (partialSeed) => {
  const factory = new Factory(ImageData);
  const noun = factory.createItem(props.partialSeed);

  return <img src={noun.dataUrl} alt='noun' />;
};

// another component
import Noun from "./Noun";

const seed = {
	head: 'zebra',
	glasses: 'fullblack'
}

export default View = () => {
	return (
		<Noun partialSeed={seed} />
	)
}
```

Noun from seed:

```jsx
// noun component
import { Factory } from "@cloudnouns/factory";
import ImageData from "./nouns.json";

export default Noun = (seed) => {
  const factory = new Factory(ImageData);
  const noun = factory.createItemFromSeed(props.seed);

  return <img src={noun.dataUrl} alt='noun' />;
};

// another component
import Noun from "./Noun";

const seed = {
	head: 233,
	glasses: 7,
	body: 9,
	accessory: 54,
	background: 0
}

export default View = () => {
	return (
		<Noun seed={seed} />
	)
}
```
