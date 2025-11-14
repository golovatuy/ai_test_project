import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createTicket } from '../../services/api';
import Input from '../UI/Input';
import Textarea from '../UI/Textarea';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import Alert from '../UI/Alert';
import { validateTicketForm } from '../../utils/validation';

const TicketForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [createdTicketId, setCreatedTicketId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    // Client-side validation
    const validation = validateTicketForm(data);
    if (!validation.isValid) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    setCreatedTicketId(null);

    try {
      const response = await createTicket(data);
      
      if (response.success && response.data) {
        setSubmitSuccess('Ticket submitted successfully!');
        setCreatedTicketId(response.data._id);
        reset(); // Clear form
      }
    } catch (error) {
      setSubmitError(
        error.message || 'Failed to submit ticket. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Support Ticket</h2>

      {submitSuccess && (
        <Alert type="success">
          <div>
            <p className="font-medium">{submitSuccess}</p>
            {createdTicketId && (
              <p className="text-sm mt-1">
                Your ticket ID: <span className="font-mono font-semibold">{createdTicketId}</span>
              </p>
            )}
          </div>
        </Alert>
      )}

      {submitError && (
        <Alert type="error" onClose={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Customer Name"
          {...register('customerName', {
            required: 'Customer name is required',
            maxLength: {
              value: 100,
              message: 'Customer name cannot exceed 100 characters'
            }
          })}
          error={errors.customerName?.message}
          placeholder="John Doe"
        />

        <Input
          label="Email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please provide a valid email address'
            },
            maxLength: {
              value: 255,
              message: 'Email cannot exceed 255 characters'
            }
          })}
          error={errors.email?.message}
          placeholder="john.doe@example.com"
        />

        <Input
          label="Subject"
          {...register('subject', {
            required: 'Subject is required',
            maxLength: {
              value: 200,
              message: 'Subject cannot exceed 200 characters'
            }
          })}
          error={errors.subject?.message}
          placeholder="Brief description of your issue"
        />

        <Textarea
          label="Description"
          rows={6}
          {...register('description', {
            required: 'Description is required',
            minLength: {
              value: 10,
              message: 'Description must be at least 10 characters long'
            },
            maxLength: {
              value: 5000,
              message: 'Description cannot exceed 5000 characters'
            }
          })}
          error={errors.description?.message}
          placeholder="Please provide detailed information about your issue..."
        />

        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => reset()}
            disabled={isSubmitting}
          >
            Clear
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Submitting...
              </span>
            ) : (
              'Submit Ticket'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;

