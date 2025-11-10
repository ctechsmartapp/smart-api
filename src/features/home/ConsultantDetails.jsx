import * as React from 'react';
import Sheet from '@mui/joy/Sheet';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Typography from '@mui/joy/Typography';
import logo from './assets/image/CTI.png';
import { Link as RouterLink } from 'react-router-dom';

function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Select
      value={mode}
      onChange={(event, newMode) => {
        setMode(newMode);
      }}
      sx={{ width: 'max-content' }}
    >
      <Option value="system">System</Option>
      <Option value="light">Light</Option>
      <Option value="dark">Dark</Option>
    </Select>
  );
}


const handleAddConsultant = async () => 
    {
    try {
      const res = await fetch("http://localhost:5000/consultants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(consultant),
      });

      const data = await res.json();
      alert(data.message || "Consultant added successfully!");
    } catch (err) {
      console.error("Error adding consultant:", err);
      alert("Something went wrong while adding consultant.");
}
};
export default function ConsultantDetails() {
  return (
    <CssVarsProvider>
      {/* Logo fixed to top-left outside the Sheet */}
      <img
        src={logo}
        alt="Logo"
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          height: 100,
          width: 400,
        }}
      />

      <Sheet
        sx={{
          width: 320,
          mx: 'auto',
          my: 8,
          py: 3,
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 'sm',
          boxShadow: 'md',
        }}
      >
        
        <FormControl>
          <FormLabel>First Name</FormLabel>
          <Input name="firstName" placeholder="First Name" />
        </FormControl>

        <FormControl>
          <FormLabel>Last Name</FormLabel>
          <Input name="lastName" placeholder="Last Name" />
        </FormControl>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type="email" name="email" placeholder="example@email.com" />
        </FormControl>

        <FormControl>
          <FormLabel>Phone Number</FormLabel>
          <Input type="number" name="number" placeholder="Enter Phone Number" />
        </FormControl>

        <FormControl>
          <FormLabel>Legal Status</FormLabel>
          <Select name="legalStatus" placeholder="Select Legal Status">
                        
            <Option value="cpt">CPT</Option>
            <Option value="opt">OPT</Option>
            <Option value="stem opt">STEM OPT</Option>
            <Option value="h1b">H1B</Option>
            <Option value="greenCard">Green Card </Option>
            <Option value="citizen">Citizen</Option>
                        
          </Select>
        </FormControl>

         <Button 
         onClick={handleAddConsultant}
         sx={{ mt: 2 }}>Add Consultant
         </Button>
         
         
        <Typography
          endDecorator={<Link href="/">Log in</Link>}
          fontSize="sm"
          sx={{ alignSelf: 'center' }}
        >
          Already have an account?
        </Typography>
      </Sheet>

      <div style={{ position: 'absolute', top: 16, right: 16 }}>
        <ModeToggle />
      </div>
    </CssVarsProvider>
  );
}
