export interface BoltConfig {
  item: string;
	options?: { [key: string]: string };
  layers: Layers;
}

export type Noun = BoltItem

interface BoltItem extends Traits {
  dataUrl: string;
  seed: Seed;
}

type Layers = {
  bgcolors: string[];
  palette: string[];
  images: Images;
};
type Layer = "background" | DataLayer;
type DataLayer = "bodies" | "accessories" | "heads" | "glasses";
type Images = { [key in DataLayer]: Image[] };
type Image = {
  filename: string;
  data: string;
};
type Seed = { [key in Layer]: number };
type ArraySeed = [number, number, number, number, number];
type Traits = { [key in Layer]: string };
type PartialTraits = {
	background?: BackgroundColor;
	bodies?: BodiesLayer;
	accessories?: AccessoriesLayer;
	heads?: HeadsLayer;
	glasses?: GlassesLayer;
};

type BackgroundColor = 
	| "#d5d7e1"
	| "#e1d7d5";

type BodiesLayer = 
	| 'body-bege-bsod'
	| 'body-bege-crt'
	| 'body-blue-sky'
	| 'body-bluegrey'
	| 'body-cold'
	| 'body-computerblue'
	| 'body-darkbrown'
	| 'body-darkpink'
	| 'body-foggrey'
	| 'body-gold'
	| 'body-grayscale-1'
	| 'body-grayscale-7'
	| 'body-grayscale-8'
	| 'body-grayscale-9'
	| 'body-green'
	| 'body-gunk'
	| 'body-hotbrown'
	| 'body-magenta'
	| 'body-orange-yellow'
	| 'body-orange'
	| 'body-peachy-b'
	| 'body-peachy-a'
	| 'body-purple'
	| 'body-red'
	| 'body-redpinkish'
	| 'body-rust'
	| 'body-slimegreen'
	| 'body-teal-light'
	| 'body-teal'
	| 'body-yellow';

type AccessoriesLayer = 
	| 'accessory-1n'
	| 'accessory-aardvark'
	| 'accessory-axe'
	| 'accessory-belly-chameleon'
	| 'accessory-bird-flying'
	| 'accessory-bird-side'
	| 'accessory-bling-anchor'
	| 'accessory-bling-anvil'
	| 'accessory-bling-arrow'
	| 'accessory-bling-cheese'
	| 'accessory-bling-gold-ingot'
	| 'accessory-bling-love'
	| 'accessory-bling-mask'
	| 'accessory-bling-rings'
	| 'accessory-bling-scissors'
	| 'accessory-bling-sparkles'
	| 'accessory-body-gradient-checkerdisco'
	| 'accessory-body-gradient-dawn'
	| 'accessory-body-gradient-dusk'
	| 'accessory-body-gradient-glacier'
	| 'accessory-body-gradient-ice'
	| 'accessory-body-gradient-pride'
	| 'accessory-body-gradient-redpink'
	| 'accessory-body-gradient-sunset'
	| 'accessory-carrot'
	| 'accessory-chain-logo'
	| 'accessory-checker-rgb'
	| 'accessory-checker-bigwalk-blue-prime'
	| 'accessory-checker-bigwalk-greylight'
	| 'accessory-checker-bigwalk-rainbow'
	| 'accessory-checker-spaced-black'
	| 'accessory-checker-spaced-white'
	| 'accessory-checker-vibrant'
	| 'accessory-checkers-big-green'
	| 'accessory-checkers-big-red-cold'
	| 'accessory-checkers-black'
	| 'accessory-checkers-blue'
	| 'accessory-checkers-magenta-80'
	| 'accessory-chicken'
	| 'accessory-cloud'
	| 'accessory-clover'
	| 'accessory-collar-sunset'
	| 'accessory-cow'
	| 'accessory-decay-gray-dark'
	| 'accessory-decay-pride'
	| 'accessory-dinosaur'
	| 'accessory-dollar-bling'
	| 'accessory-dragon'
	| 'accessory-ducky'
	| 'accessory-eth'
	| 'accessory-eye'
	| 'accessory-flash'
	| 'accessory-fries'
	| 'accessory-glasses-logo-sun'
	| 'accessory-glasses-logo'
	| 'accessory-glasses'
	| 'accessory-grid-simple-bege'
	| 'accessory-heart'
	| 'accessory-hoodiestrings-uneven'
	| 'accessory-id'
	| 'accessory-infinity'
	| 'accessory-insignia'
	| 'accessory-leaf'
	| 'accessory-lightbulb'
	| 'accessory-lines-45-greens'
	| 'accessory-lines-45-rose'
	| 'accessory-lp'
	| 'accessory-marsface'
	| 'accessory-matrix-white'
	| 'accessory-moon-block'
	| 'accessory-none'
	| 'accessory-oldshirt'
	| 'accessory-pizza-bling'
	| 'accessory-pocket-pencil'
	| 'accessory-rain'
	| 'accessory-rainbow-steps'
	| 'accessory-rgb'
	| 'accessory-robot'
	| 'accessory-safety-vest'
	| 'accessory-scarf-clown'
	| 'accessory-secret-x'
	| 'accessory-shirt-black'
	| 'accessory-shrimp'
	| 'accessory-slimesplat'
	| 'accessory-small-bling'
	| 'accessory-snowflake'
	| 'accessory-stains-blood'
	| 'accessory-stains-zombie'
	| 'accessory-stripes-and-checks'
	| 'accessory-stripes-big-red'
	| 'accessory-stripes-blit'
	| 'accessory-stripes-blue-med'
	| 'accessory-stripes-brown'
	| 'accessory-stripes-olive'
	| 'accessory-stripes-red-cold'
	| 'accessory-sunset'
	| 'accessory-taxi-checkers'
	| 'accessory-tee-yo'
	| 'accessory-text-yolo'
	| 'accessory-think'
	| 'accessory-tie-black-on-white'
	| 'accessory-tie-dye'
	| 'accessory-tie-purple-on-white'
	| 'accessory-tie-red'
	| 'accessory-txt-a2+b2'
	| 'accessory-txt-cc'
	| 'accessory-txt-cc2'
	| 'accessory-txt-copy'
	| 'accessory-txt-dao-black'
	| 'accessory-txt-doom'
	| 'accessory-txt-dope-text'
	| 'accessory-txt-foo-black'
	| 'accessory-txt-ico'
	| 'accessory-txt-io'
	| 'accessory-txt-lmao'
	| 'accessory-txt-lol'
	| 'accessory-txt-mint'
	| 'accessory-txt-nil-grey-dark'
	| 'accessory-txt-noun-f0f'
	| 'accessory-txt-noun-green'
	| 'accessory-txt-noun-multicolor'
	| 'accessory-txt-noun'
	| 'accessory-txt-pi'
	| 'accessory-txt-pop'
	| 'accessory-txt-rofl'
	| 'accessory-txt-we'
	| 'accessory-txt-yay'
	| 'accessory-wall'
	| 'accessory-wave'
	| 'accessory-wet-money'
	| 'accessory-woolweave-bicolor'
	| 'accessory-woolweave-dirt'
	| 'accessory-yingyang'
	| 'body-bege'
	| 'body-gray-scale-1'
	| 'body-gray-scale-9'
	| 'body-ice-cold'
	| 'accessory-grease'
	| 'accessory-tatewaku'
	| 'accessory-uroko';

type HeadsLayer = 
	| 'head-aardvark'
	| 'head-abstract'
	| 'head-ape'
	| 'head-bag'
	| 'head-bagpipe'
	| 'head-banana'
	| 'head-bank'
	| 'head-baseball-gameball'
	| 'head-basketball'
	| 'head-bat'
	| 'head-bear'
	| 'head-beer'
	| 'head-beet'
	| 'head-bell'
	| 'head-bigfoot-yeti'
	| 'head-bigfoot'
	| 'head-blackhole'
	| 'head-blueberry'
	| 'head-bomb'
	| 'head-bonsai'
	| 'head-boombox'
	| 'head-boot'
	| 'head-box'
	| 'head-boxingglove'
	| 'head-brain'
	| 'head-bubble-speech'
	| 'head-bubblegum'
	| 'head-burger-dollarmenu'
	| 'head-cake'
	| 'head-calculator'
	| 'head-calendar'
	| 'head-camcorder'
	| 'head-cannedham'
	| 'head-car'
	| 'head-cash-register'
	| 'head-cassettetape'
	| 'head-cat'
	| 'head-cd'
	| 'head-chain'
	| 'head-chainsaw'
	| 'head-chameleon'
	| 'head-chart-bars'
	| 'head-cheese'
	| 'head-chefhat'
	| 'head-cherry'
	| 'head-chicken'
	| 'head-chilli'
	| 'head-chipboard'
	| 'head-chips'
	| 'head-chocolate'
	| 'head-cloud'
	| 'head-clover'
	| 'head-clutch'
	| 'head-coffeebean'
	| 'head-cone'
	| 'head-console-handheld'
	| 'head-cookie'
	| 'head-cordlessphone'
	| 'head-cottonball'
	| 'head-cow'
	| 'head-crab'
	| 'head-crane'
	| 'head-croc-hat'
	| 'head-crown'
	| 'head-crt-bsod'
	| 'head-crystalball'
	| 'head-diamond-blue'
	| 'head-diamond-red'
	| 'head-dictionary'
	| 'head-dino'
	| 'head-dna'
	| 'head-dog'
	| 'head-doughnut'
	| 'head-drill'
	| 'head-duck'
	| 'head-ducky'
	| 'head-earth'
	| 'head-egg'
	| 'head-faberge'
	| 'head-factory-dark'
	| 'head-fan'
	| 'head-fence'
	| 'head-film-35mm'
	| 'head-film-strip'
	| 'head-fir'
	| 'head-firehydrant'
	| 'head-flamingo'
	| 'head-flower'
	| 'head-fox'
	| 'head-frog'
	| 'head-garlic'
	| 'head-gavel'
	| 'head-ghost-b'
	| 'head-glasses-big'
	| 'head-gnome'
	| 'head-goat'
	| 'head-goldcoin'
	| 'head-goldfish'
	| 'head-grouper'
	| 'head-hair'
	| 'head-hardhat'
	| 'head-heart'
	| 'head-helicopter'
	| 'head-highheel'
	| 'head-hockeypuck'
	| 'head-horse-deepfried'
	| 'head-hotdog'
	| 'head-house'
	| 'head-icepop-b'
	| 'head-igloo'
	| 'head-island'
	| 'head-jellyfish'
	| 'head-jupiter'
	| 'head-kangaroo'
	| 'head-ketchup'
	| 'head-laptop'
	| 'head-lightning-bolt'
	| 'head-lint'
	| 'head-lips'
	| 'head-lipstick2'
	| 'head-lock'
	| 'head-macaroni'
	| 'head-mailbox'
	| 'head-maze'
	| 'head-microwave'
	| 'head-milk'
	| 'head-mirror'
	| 'head-mixer'
	| 'head-moon'
	| 'head-moose'
	| 'head-mosquito'
	| 'head-mountain-snowcap'
	| 'head-mouse'
	| 'head-mug'
	| 'head-mushroom'
	| 'head-mustard'
	| 'head-nigiri'
	| 'head-noodles'
	| 'head-onion'
	| 'head-orangutan'
	| 'head-orca'
	| 'head-otter'
	| 'head-outlet'
	| 'head-owl'
	| 'head-oyster'
	| 'head-paintbrush'
	| 'head-panda'
	| 'head-paperclip'
	| 'head-peanut'
	| 'head-pencil-tip'
	| 'head-peyote'
	| 'head-piano'
	| 'head-pickle'
	| 'head-pie'
	| 'head-piggybank'
	| 'head-pill'
	| 'head-pillow'
	| 'head-pineapple'
	| 'head-pipe'
	| 'head-pirateship'
	| 'head-pizza'
	| 'head-plane'
	| 'head-pop'
	| 'head-porkbao'
	| 'head-potato'
	| 'head-pufferfish'
	| 'head-pumpkin'
	| 'head-pyramid'
	| 'head-queencrown'
	| 'head-rabbit'
	| 'head-rainbow'
	| 'head-rangefinder'
	| 'head-raven'
	| 'head-retainer'
	| 'head-rgb'
	| 'head-ring'
	| 'head-road'
	| 'head-robot'
	| 'head-rock'
	| 'head-rosebud'
	| 'head-ruler-triangular'
	| 'head-saguaro'
	| 'head-sailboat'
	| 'head-sandwich'
	| 'head-saturn'
	| 'head-saw'
	| 'head-scorpion'
	| 'head-shark'
	| 'head-shower'
	| 'head-skateboard'
	| 'head-skeleton-hat'
	| 'head-skilift'
	| 'head-smile'
	| 'head-snowglobe'
	| 'head-snowmobile'
	| 'head-spaghetti'
	| 'head-sponge'
	| 'head-squid'
	| 'head-stapler'
	| 'head-star-sparkles'
	| 'head-steak'
	| 'head-sunset'
	| 'head-taco-classic'
	| 'head-taxi'
	| 'head-thumbsup'
	| 'head-toaster'
	| 'head-toiletpaper-full'
	| 'head-tooth'
	| 'head-toothbrush-fresh'
	| 'head-tornado'
	| 'head-trashcan'
	| 'head-turing'
	| 'head-ufo'
	| 'head-undead'
	| 'head-unicorn'
	| 'head-vent'
	| 'head-void'
	| 'head-volcano'
	| 'head-volleyball'
	| 'head-wall'
	| 'head-wallet'
	| 'head-wallsafe'
	| 'head-washingmachine'
	| 'head-watch'
	| 'head-watermelon'
	| 'head-wave'
	| 'head-weed'
	| 'head-weight'
	| 'head-werewolf'
	| 'head-whale-alive'
	| 'head-whale'
	| 'head-wine'
	| 'head-wizardhat'
	| 'head-zebra'
	| 'head-capybara'
	| 'head-couch'
	| 'head-hanger'
	| 'head-index-card'
	| 'head-snowman'
	| 'head-treasurechest'
	| 'head-vending-machine'
	| 'head-wine-barrel';

type GlassesLayer = 
	| 'glasses-hip-rose'
	| 'glasses-square-black-eyes-red'
	| 'glasses-square-black-rgb'
	| 'glasses-square-black'
	| 'glasses-square-blue-med-saturated'
	| 'glasses-square-blue'
	| 'glasses-square-frog-green'
	| 'glasses-square-fullblack'
	| 'glasses-square-green-blue-multi'
	| 'glasses-square-grey-light'
	| 'glasses-square-guava'
	| 'glasses-square-honey'
	| 'glasses-square-magenta'
	| 'glasses-square-orange'
	| 'glasses-square-pink-purple-multi'
	| 'glasses-square-red'
	| 'glasses-square-smoke'
	| 'glasses-square-teal'
	| 'glasses-square-watermelon'
	| 'glasses-square-yellow-orange-multi'
	| 'glasses-square-yellow-saturated'
	| 'glasses-deep-teal'
	| 'glasses-grass';
