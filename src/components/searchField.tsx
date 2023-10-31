import { alpha, styled } from "@mui/material/styles"
import TextField, { TextFieldProps } from "@mui/material/TextField"

/**
 * Customize the TextField component for search input
 *
 * @see https://mui.com/components/text-fields/#customized-inputs
 */
export const SearchField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#FFF",
  },
  "& label": {
    color: "#DDD",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#BBB",
  },
  "& .MuiOutlinedInput-root": {
    color: "pink",
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "#E0E3E7",
    },
    "&:hover fieldset": {
      borderColor: "#BBB",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#FFF",
    },
  },
  "& .MuiOutlinedInput-input": {
    color: "#FFF",
    "&::placeholder": {
      color: "#A0AAB4",
    },
  },
})
