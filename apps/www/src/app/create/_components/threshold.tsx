'use client';

import React from 'react';
import { type FieldErrors, useForm } from 'react-hook-form';

import { useCreateVaultStore } from '~/lib/stores';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';

import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

export const ThresholdSelect = () => {
  const { goToNextStep, goToPreviousStep } = useCreateVaultStore();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: FormSchema) => {
    console.log(values);
    goToNextStep();
  };

  const onError = (errors: FieldErrors<FormSchema>) => {
    console.log(errors);
    toast.error(
      errors.root?.message ??
        errors.threshold?.message ??
        errors.total?.message ??
        'An error occurred'
    );
  };

  return (
    <div className='flex h-full flex-col gap-4'>
      <div className='mx-auto max-w-sm pt-4 text-center text-xl font-semibold text-neutral-700'>
        Configure Threshold for Vault Access and Key Recovery
      </div>
      <div className='h-full'>
        <Form {...form}>
          <form
            className='flex h-full flex-col justify-between space-y-4'
            onSubmit={form.handleSubmit(onSubmit, onError)}
          >
            <div className='flex flex-col gap-4'>
              <FormField
                control={form.control}
                name='total'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Shares</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Total Shares'
                        type='number'
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Total number of shares for the vault
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='threshold'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Threshold</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Threshold Shares'
                        type='number'
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Number of shares required to access the vault
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex w-full flex-row items-center gap-4'>
              <Button
                className='w-full'
                type='button'
                variant='outline'
                onClick={goToPreviousStep}
              >
                <ArrowLeftIcon className='mr-2 h-4 w-4' />
                Back
              </Button>
              <Button className='w-full' type='submit'>
                Next
                <ArrowRightIcon className='ml-2 h-4 w-4' />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

const formSchema = z
  .object({
    threshold: z
      .number()
      .int('Threshold must be a number')
      .min(1, 'Threshold must be a number greater than 0')
      .max(10, 'Threshold must be a number less than 10'),
    total: z
      .number()
      .int('Total must be a number')
      .min(1, 'Total must be a number greater than 0'),
  })
  .refine((data) => data.threshold <= data.total, {
    message: 'Threshold must be less than or equal to Total',
    path: ['threshold'],
  });

type FormSchema = z.infer<typeof formSchema>;
