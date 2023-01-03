/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { FunctionComponent } from 'react';
import {
  FormControl,
  Grid,
  Input,
  InputLabel,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { MakerHubState } from '@openworkshop/maker-hub/deployments';
import {
  MakerHubSessionFragment,
  MakerverseSupportTicketRequestInput,
  useMakerverseSupportTicketMutation,
} from '@openworkshop/maker-hub/components/schema';
import { AlertList } from '@openworkshop/maker-hub/components';

const SupportTicketForm: FunctionComponent = () => {
  const [subj, setSubj] = React.useState<string>('');
  const [body, setBody] = React.useState<string>('');
  const session = useSelector<
    MakerHubState,
    MakerHubSessionFragment | undefined
  >((state) => state.hub.session);
  const [email, setEmail] = React.useState<string>(session?.user.email ?? '');
  const [category, setCategory] = React.useState<string | undefined>(undefined);
  const [doUpload, setDoUpload] = React.useState<boolean>(false);
  const [file, setFile] = React.useState<File | undefined>(undefined);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);

  const [createTicket] = useMakerverseSupportTicketMutation();

  let formValid = body.length > 0 && email.length > 0;
  if (category === 'Project') {
    if (doUpload && !file) {
      formValid = false;
    }
  }
  if (category === 'Other' && subj.length === 0) {
    formValid = false;
  }

  const blobToBase64 = (blob: Blob): Promise<string> => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        if (reader.result !== null) {
          resolve(reader.result as string);
        }
      };
    });
  };

  const submitTicket = async () => {
    setLoading(true);
    let fileData = '';

    if (file) {
      fileData = await blobToBase64(file);
    }

    const input: MakerverseSupportTicketRequestInput = {
      description: body,
      email: email,
      subject: category || `Custom - ${subj}`,
      file: file ? fileData : '',
      filename: file ? file.name : '',
    };

    try {
      await createTicket({ variables: { req: input } });
      setSuccess(true);
    } catch (e) {
      setError(true);
    }
    setLoading(false);
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>Help Request</Typography>
        <Typography variant='body1'>
          Please complete this form to submit a help request
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControl
          // className={classes.input}
          margin='normal'
          fullWidth={true}
          required={true}
          variant='outlined'
        >
          <InputLabel htmlFor='email'>Your email</InputLabel>
          <Input
            id='email'
            type='email'
            name='email'
            // error={errors.email.length > 0}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            startAdornment={
              <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: 8 }} />
            }
          />
        </FormControl>
        <br />
        <br />
        <FormControl fullWidth variant='outlined'>
          <Select
            labelId='category-dropdown-label'
            id='cat-dropdown'
            value={category}
            label='Issue Type'
            onChange={(e) => {
              setCategory(e.target.value);
              //Do noting
            }}
          >
            <MenuItem value='Login'>Login</MenuItem>
            <MenuItem value='Calibration'>Calibration</MenuItem>
            <MenuItem value='Project'>Project Error</MenuItem>
            <MenuItem value='Connection'>Connection</MenuItem>
            <MenuItem value='Other'>Other (Specify)</MenuItem>
          </Select>
          <InputLabel htmlFor='cat-dropdown'>Category</InputLabel>
        </FormControl>
        {category === 'Project' ? (
          <>
            <br />
            <br />
            <Grid container>
              <Grid item xs={4}>
                <FormControl>
                  <FormLabel id='do-upload-label'>
                    Upload project file?
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby='do-upload-label'
                    defaultValue='no'
                    value={doUpload ? 'yes' : 'no'}
                    onChange={(e) => {
                      setDoUpload(e.target.value === 'yes');
                    }}
                  >
                    <FormControlLabel
                      value='yes'
                      control={<Radio />}
                      label='Yes'
                    />
                    <FormControlLabel
                      value='no'
                      control={<Radio />}
                      label='No'
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                {doUpload ? (
                  <>
                    <input
                      type='file'
                      id='file-selector'
                      accept='.nc,.gcode,.mpt,.mpf'
                      hidden
                      onChange={(e) => {
                        if (e.target.files) {
                          const file = e.target.files[0];
                          if (e.target.files[0]) {
                            setFile(e.target.files[0]);
                          } else {
                            setFile(undefined);
                          }
                        } else {
                          setFile(undefined);
                        }
                      }}
                    />
                    <label htmlFor='file-selector'>
                      <Button variant='contained' component='span'>
                        Select File
                      </Button>
                    </label>
                    <br />
                    <br />
                    {file ? (
                      <Typography variant='body1'>{file.name}</Typography>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>
          </>
        ) : (
          <></>
        )}
        {category === 'Other' ? (
          <FormControl
            // className={classes.input}
            margin='normal'
            fullWidth={true}
            variant='filled'
          >
            <InputLabel htmlFor='subj'>
              Please specify your issue type:
            </InputLabel>
            <Input
              id='subj'
              type='subj'
              name='subj'
              // error={errors.email.length > 0}
              value={subj}
              onChange={(e) => setSubj(e.target.value)}
            />
          </FormControl>
        ) : (
          <></>
        )}

        <FormControl
          // className={classes.input}
          margin='normal'
          fullWidth={true}
          variant='outlined'
        >
          <TextField
            id='body'
            type='body'
            name='body'
            label='Description'
            multiline={true}
            // error={errors.email.length > 0}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant='contained'
          disabled={loading || !formValid || success}
          onClick={() => {
            void submitTicket();
          }}
        >
          Submit Help Request
        </Button>
      </Grid>
      <Grid item xs={12}>
        <AlertList
          error={
            error
              ? { name: 'Error', message: 'An unexpected error has occurred' }
              : undefined
          }
          notice={
            success
              ? {
                  name: 'Success',
                  message:
                    'Your ticket has been submitted. Someone will reach out to you shortly about your issue.',
                }
              : undefined
          }
        />
      </Grid>
    </Grid>
  );
};

export default SupportTicketForm;
