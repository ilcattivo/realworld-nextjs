import { useField } from "formik";
import { TextField } from "@material-ui/core";

export default function MyTextField(props) {
  const [field, meta] = useField(props);
  const { error, touched } = meta;

  return (
    <TextField
      {...field}
      {...props}
      error={touched && Boolean(error)}
      helperText={touched && error}
      variant="outlined"
    />
  );
}
