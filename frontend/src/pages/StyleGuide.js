import React, { useState } from 'react';
import { Typography, Button, Card, Input } from '../styles/components';

const StyleGuide = () => {
  const [activeSection, setActiveSection] = useState('typography');
  
  // Navigation between sections to avoid scrolling
  const renderContent = () => {
    switch(activeSection) {
      case 'typography':
        return <TypographySection />;
      case 'colors':
        return <ColorsSection />;
      case 'buttons':
        return <ButtonsSection />;
      case 'cards':
        return <CardsSection />;
      case 'inputs':
        return <InputsSection />;
      default:
        return <TypographySection />;
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 mb-4">
        <Typography variant="h1" className="mb-4">Style Guide</Typography>
        
        <div className="flex flex-wrap gap-2">
          <NavButton 
            active={activeSection === 'typography'} 
            onClick={() => setActiveSection('typography')}
          >
            Typography
          </NavButton>
          <NavButton 
            active={activeSection === 'colors'} 
            onClick={() => setActiveSection('colors')}
          >
            Colors
          </NavButton>
          <NavButton 
            active={activeSection === 'buttons'} 
            onClick={() => setActiveSection('buttons')}
          >
            Buttons
          </NavButton>
          <NavButton 
            active={activeSection === 'cards'} 
            onClick={() => setActiveSection('cards')}
          >
            Cards
          </NavButton>
          <NavButton 
            active={activeSection === 'inputs'} 
            onClick={() => setActiveSection('inputs')}
          >
            Inputs
          </NavButton>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <Card variant="outlined" className="h-full">
          {renderContent()}
        </Card>
      </div>
    </div>
  );
};

// Navigation button for sections
const NavButton = ({ children, active, onClick }) => (
  <button
    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
      active 
        ? 'bg-gray-900 text-white' 
        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

// Individual sections
const TypographySection = () => (
  <div className="h-full overflow-auto p-6">
    <Typography variant="h2" className="mb-4">Typography</Typography>
    <div className="space-y-4">
      <Typography variant="h1" className="mb-4">Heading 1</Typography>
      <Typography variant="h2" className="mb-4">Heading 2</Typography>
      <Typography variant="h3" className="mb-4">Heading 3</Typography>
      <Typography variant="h4" className="mb-4">Heading 4</Typography>
      <Typography variant="h5" className="mb-4">Heading 5</Typography>
      <Typography variant="h6" className="mb-4">Heading 6</Typography>
      <Typography variant="subtitle1" className="mb-4">Subtitle 1</Typography>
      <Typography variant="subtitle2" className="mb-4">Subtitle 2</Typography>
      <Typography variant="body1" className="mb-4">Body 1: This is some example text to demonstrate the body1 typography style.</Typography>
      <Typography variant="body2" className="mb-4">Body 2: This is some example text to demonstrate the body2 typography style.</Typography>
      <Typography variant="caption">Caption text</Typography>
    </div>
  </div>
);

const ColorsSection = () => (
  <div className="h-full overflow-auto p-6">
    <Typography variant="h2" className="mb-4">Colors</Typography>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Typography variant="h4" className="mb-4">Gray Scale</Typography>
        <div className="space-y-2">
          <ColorSwatch color="bg-gray-50" name="Gray 50" hex="#FAFAFA" />
          <ColorSwatch color="bg-gray-100" name="Gray 100" hex="#F5F5F5" />
          <ColorSwatch color="bg-gray-200" name="Gray 200" hex="#EEEEEE" />
          <ColorSwatch color="bg-gray-300" name="Gray 300" hex="#E0E0E0" />
          <ColorSwatch color="bg-gray-400" name="Gray 400" hex="#BDBDBD" />
          <ColorSwatch color="bg-gray-500" name="Gray 500" hex="#9E9E9E" textWhite />
          <ColorSwatch color="bg-gray-600" name="Gray 600" hex="#757575" textWhite />
          <ColorSwatch color="bg-gray-700" name="Gray 700" hex="#616161" textWhite />
          <ColorSwatch color="bg-gray-800" name="Gray 800" hex="#424242" textWhite />
          <ColorSwatch color="bg-gray-900" name="Gray 900" hex="#212121" textWhite />
        </div>
      </div>
      <div>
        <Typography variant="h4" className="mb-4">Utility Colors</Typography>
        <div className="space-y-2">
          <ColorSwatch color="bg-black" name="Black" hex="#000000" textWhite />
          <ColorSwatch color="bg-white border border-gray-200" name="White" hex="#FFFFFF" />
        </div>
      </div>
    </div>
  </div>
);

const ButtonsSection = () => (
  <div className="h-full overflow-auto p-6">
    <Typography variant="h2" className="mb-4">Buttons</Typography>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="space-y-4">
        <Typography variant="h4" className="mb-2">Primary</Typography>
        <div className="space-y-2">
          <Button variant="primary" size="small">Small</Button>
          <div><Button variant="primary" size="medium">Medium</Button></div>
          <div><Button variant="primary" size="large">Large</Button></div>
          <div><Button variant="primary" disabled>Disabled</Button></div>
        </div>
      </div>
      
      <div className="space-y-4">
        <Typography variant="h4" className="mb-2">Secondary</Typography>
        <div className="space-y-2">
          <Button variant="secondary" size="small">Small</Button>
          <div><Button variant="secondary" size="medium">Medium</Button></div>
          <div><Button variant="secondary" size="large">Large</Button></div>
          <div><Button variant="secondary" disabled>Disabled</Button></div>
        </div>
      </div>
      
      <div className="space-y-4">
        <Typography variant="h4" className="mb-2">Text</Typography>
        <div className="space-y-2">
          <Button variant="text" size="small">Small</Button>
          <div><Button variant="text" size="medium">Medium</Button></div>
          <div><Button variant="text" size="large">Large</Button></div>
          <div><Button variant="text" disabled>Disabled</Button></div>
        </div>
      </div>
    </div>
  </div>
);

const CardsSection = () => (
  <div className="h-full overflow-auto p-6">
    <Typography variant="h2" className="mb-4">Cards</Typography>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card variant="elevated">
        <Typography variant="h4" className="mb-2">Elevated Card</Typography>
        <Typography variant="body1">This card has a shadow elevation.</Typography>
      </Card>
      
      <Card variant="outlined">
        <Typography variant="h4" className="mb-2">Outlined Card</Typography>
        <Typography variant="body1">This card has a border outline.</Typography>
      </Card>
      
      <Card variant="flat">
        <Typography variant="h4" className="mb-2">Flat Card</Typography>
        <Typography variant="body1">This card is flat with no border or shadow.</Typography>
      </Card>
      
      <Card fixedHeight variant="outlined" className="h-64 col-span-full md:col-span-1">
        <div className="fixed-height-card-header">
          <Typography variant="h4">Fixed Height Card</Typography>
        </div>
        <div className="fixed-height-card-content">
          <Typography variant="body1">
            This card has a fixed height with scrollable content.
            <br /><br />
            The header and footer remain fixed while the content area scrolls if needed.
            <br /><br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
            <br /><br />
            Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus.
          </Typography>
        </div>
        <div className="fixed-height-card-footer">
          <Button variant="primary" size="small">Action</Button>
        </div>
      </Card>
    </div>
  </div>
);

const InputsSection = () => (
  <div className="h-full overflow-auto p-6">
    <Typography variant="h2" className="mb-4">Inputs</Typography>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Input
          label="Text Input"
          placeholder="Enter some text"
          type="text"
        />
        
        <Input
          label="Email Input"
          placeholder="Enter your email"
          type="email"
          helperText="We'll never share your email."
        />
        
        <Input
          label="Password Input"
          placeholder="Enter your password"
          type="password"
        />
      </div>
      
      <div>
        <Input
          label="Number Input"
          placeholder="Enter a number"
          type="number"
        />
        
        <Input
          label="Error State"
          placeholder="This input has an error"
          type="text"
          error
          helperText="This is an error message"
        />
        
        <Input
          label="Disabled Input"
          placeholder="This input is disabled"
          type="text"
          disabled
        />
      </div>
    </div>
  </div>
);

// Helper component for color swatches
const ColorSwatch = ({ color, name, hex, textWhite }) => (
  <div className="flex items-center">
    <div className={`w-16 h-16 rounded-md mr-4 ${color}`}></div>
    <div>
      <Typography variant="body1" className={textWhite ? "text-white" : ""}>{name}</Typography>
      <Typography variant="caption" className={textWhite ? "text-gray-300" : "text-gray-500"}>{hex}</Typography>
    </div>
  </div>
);

export default StyleGuide; 