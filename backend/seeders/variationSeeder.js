const Variation = require('../models/variation');
const VariationValue = require('../models/variation_value');

const seedVariations = async () => {
  try {
    console.log('Seeding variations...');

    // Create variation types
    const variations = [
      {
        name: 'size',
        display_name: 'Size',
        description: 'Product size variations'
      },
      {
        name: 'color',
        display_name: 'Color',
        description: 'Product color variations'
      },
      {
        name: 'material',
        display_name: 'Material',
        description: 'Product material variations'
      },
      {
        name: 'style',
        display_name: 'Style',
        description: 'Product style variations'
      }
    ];

    // Insert variations
    const createdVariations = [];
    for (const variation of variations) {
      const existingVariation = await Variation.findOne({ name: variation.name });
      if (!existingVariation) {
        const newVariation = new Variation(variation);
        await newVariation.save();
        createdVariations.push(newVariation);
        console.log(`Created variation: ${variation.display_name}`);
      } else {
        createdVariations.push(existingVariation);
        console.log(`Variation already exists: ${variation.display_name}`);
      }
    }

    // Create variation values
    const variationValues = [
      // Size values
      {
        variation_id: createdVariations.find(v => v.name === 'size')._id,
        name: 'xs',
        display_name: 'XS',
        color_code: null
      },
      {
        variation_id: createdVariations.find(v => v.name === 'size')._id,
        name: 's',
        display_name: 'S',
        color_code: null
      },
      {
        variation_id: createdVariations.find(v => v.name === 'size')._id,
        name: 'm',
        display_name: 'M',
        color_code: null
      },
      {
        variation_id: createdVariations.find(v => v.name === 'size')._id,
        name: 'l',
        display_name: 'L',
        color_code: null
      },
      {
        variation_id: createdVariations.find(v => v.name === 'size')._id,
        name: 'xl',
        display_name: 'XL',
        color_code: null
      },
      {
        variation_id: createdVariations.find(v => v.name === 'size')._id,
        name: 'xxl',
        display_name: 'XXL',
        color_code: null
      },
      // Color values
      {
        variation_id: createdVariations.find(v => v.name === 'color')._id,
        name: 'red',
        display_name: 'Red',
        color_code: '#FF0000'
      },
      {
        variation_id: createdVariations.find(v => v.name === 'color')._id,
        name: 'blue',
        display_name: 'Blue',
        color_code: '#0000FF'
      },
      {
        variation_id: createdVariations.find(v => v.name === 'color')._id,
        name: 'green',
        display_name: 'Green',
        color_code: '#00FF00'
      },
      {
        variation_id: createdVariations.find(v => v.name === 'color')._id,
        name: 'yellow',
        display_name: 'Yellow',
        color_code: '#FFFF00'
      },
      {
        variation_id: createdVariations.find(v => v.name === 'color')._id,
        name: 'black',
        display_name: 'Black',
        color_code: '#000000'
      },
      {
        variation_id: createdVariations.find(v => v.name === 'color')._id,
        name: 'white',
        display_name: 'White',
        color_code: '#FFFFFF'
      },
      // Material values
      {
        variation_id: createdVariations.find(v => v.name === 'material')._id,
        name: 'cotton',
        display_name: 'Cotton',
        color_code: null
      },
      {
        variation_id: createdVariations.find(v => v.name === 'material')._id,
        name: 'polyester',
        display_name: 'Polyester',
        color_code: null
      },
      {
        variation_id: createdVariations.find(v => v.name === 'material')._id,
        name: 'wool',
        display_name: 'Wool',
        color_code: null
      },
      {
        variation_id: createdVariations.find(v => v.name === 'material')._id,
        name: 'silk',
        display_name: 'Silk',
        color_code: null
      },
      {
        variation_id: createdVariations.find(v => v.name === 'material')._id,
        name: 'leather',
        display_name: 'Leather',
        color_code: null
      },
      // Style values
      {
        variation_id: createdVariations.find(v => v.name === 'style')._id,
        name: 'casual',
        display_name: 'Casual',
        color_code: null
      },
      {
        variation_id: createdVariations.find(v => v.name === 'style')._id,
        name: 'formal',
        display_name: 'Formal',
        color_code: null
      },
      {
        variation_id: createdVariations.find(v => v.name === 'style')._id,
        name: 'sport',
        display_name: 'Sport',
        color_code: null
      },
      {
        variation_id: createdVariations.find(v => v.name === 'style')._id,
        name: 'vintage',
        display_name: 'Vintage',
        color_code: null
      }
    ];

    // Insert variation values
    for (const value of variationValues) {
      const existingValue = await VariationValue.findOne({ 
        variation_id: value.variation_id, 
        name: value.name 
      });
      if (!existingValue) {
        const newValue = new VariationValue(value);
        await newValue.save();
        console.log(`Created variation value: ${value.display_name}`);
      } else {
        console.log(`Variation value already exists: ${value.display_name}`);
      }
    }

    console.log('Variation seeding completed!');
  } catch (error) {
    console.error('Error seeding variations:', error);
  }
};

module.exports = { seedVariations }; 