import { alpha, styled } from '@mui/material/styles';
import TextField, { TextFieldProps } from '@mui/material/TextField';

/**
 * Customize the TextField component for search input
 * 
 * @see https://mui.com/components/text-fields/#customized-inputs
 */
export const SearchField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#A0AAB4',
  },
  '& label': {
    color: '#6F7E8C',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#B2BAC2',
  },
  '& .MuiOutlinedInput-root': {
    color: 'pink',
    borderRadius: '8px',
    '& fieldset': {
      borderColor: '#E0E3E7',
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6F7E8C',
    },
  },
  '& .MuiOutlinedInput-input': {
    color: '#E0E3E7',
    '&::placeholder': {
      color: '#A0AAB4',
    },
  }
});