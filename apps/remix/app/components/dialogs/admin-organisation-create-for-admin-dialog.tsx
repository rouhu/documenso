import { trpc } from '@documenso/trpc/react';
import { ZCreateAdminOrganisationRequestSchema } from '@documenso/trpc/server/admin-router/create-admin-organisation.types';
import { Button } from '@documenso/ui/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@documenso/ui/primitives/dialog';
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from '@documenso/ui/primitives/form/form';
import { Input } from '@documenso/ui/primitives/input';
import { useToast } from '@documenso/ui/primitives/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trans, useLingui } from '@lingui/react/macro';
import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import type { z } from 'zod';

const ZForm = ZCreateAdminOrganisationRequestSchema.shape.data.pick({ name: true });

type TForm = z.infer<typeof ZForm>;

const getUserIdFromPath = (path: string) => {
  const match = path.match(/\/admin\/users\/(\d+)$/);
  return match ? Number(match[1]) : null;
};

export const AdminOrganisationCreateForAdminDialog = ({ trigger }: { trigger?: React.ReactNode }) => {
  const { t } = useLingui();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [ownerQuery, setOwnerQuery] = useState('');
  const [selectedOwnerId, setSelectedOwnerId] = useState<number | null>(null);

  const form = useForm<TForm>({
    resolver: zodResolver(ZForm),
    defaultValues: { name: '' },
  });

  const { data: searchResults, isLoading: isLoadingUsers } = trpc.admin.search.useQuery(
    { query: ownerQuery },
    { enabled: ownerQuery.trim().length > 0 },
  );

  const users = useMemo(
    () => searchResults?.groups.find((group) => group.type === 'user')?.results ?? [],
    [searchResults],
  );

  const selectedOwner = users.find((u) => getUserIdFromPath(u.path) === selectedOwnerId) ?? null;

  const { mutateAsync: createOrganisation, isPending: isCreating } = trpc.admin.organisation.create.useMutation();

  useEffect(() => {
    if (!open) {
      form.reset();
      setOwnerQuery('');
      setSelectedOwnerId(null);
    }
  }, [open, form]);

  useEffect(() => {
    if (users.length === 1) {
      const userId = getUserIdFromPath(users[0].path);
      if (userId) {
        setSelectedOwnerId(userId);
      }
    }
  }, [users]);

  const onSubmit = async (values: TForm) => {
    if (!selectedOwnerId) {
      toast({
        title: t`Owner required`,
        description: t`Please select an owner for the organisation`,
        variant: 'destructive',
      });
      return;
    }

    try {
      const { organisationId } = await createOrganisation({
        ownerUserId: selectedOwnerId,
        data: { name: values.name },
      });

      toast({ title: t`Success`, description: t`Organisation created`, duration: 5000 });
      setOpen(false);
      navigate(`/admin/organisations/${organisationId}`);
    } catch (err) {
      console.error(err);
      toast({
        title: t`An unknown error occurred`,
        description: t`Please try again later.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="secondary">
            <Trans>Create Organisation</Trans>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent position="center">
        <DialogHeader>
          <DialogTitle>
            <Trans>Create organisation</Trans>
          </DialogTitle>
          <DialogDescription>
            <Trans>Create an organisation and assign an owner</Trans>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={isCreating} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>
                      <Trans>Organisation Name</Trans>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel className="text-sm text-muted-foreground">
                  <Trans>Owner</Trans>
                </FormLabel>
                <Input
                  placeholder={t`Search users by name or email`}
                  value={ownerQuery}
                  onChange={(e) => {
                    setOwnerQuery(e.target.value);
                    setSelectedOwnerId(null);
                  }}
                />

                {selectedOwner && (
                  <div className="mt-2 flex items-start justify-between rounded-md border bg-muted/40 p-3">
                    <div className="min-w-0">
                      <div className="font-medium">
                        <Trans>Selected owner</Trans>
                      </div>
                      <div className="truncate text-sm">{selectedOwner.label}</div>
                      {selectedOwner.sublabel && (
                        <div className="truncate text-xs text-muted-foreground">{selectedOwner.sublabel}</div>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-8 w-8 shrink-0"
                      onClick={() => {
                        setSelectedOwnerId(null);
                        setOwnerQuery('');
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="mt-2 max-h-40 overflow-auto rounded-md border">
                  {isLoadingUsers ? (
                    <div className="p-2 text-sm text-muted-foreground">{t`Loading users...`}</div>
                  ) : users.length > 0 ? (
                    users.map((u) => {
                      const userId = getUserIdFromPath(u.path);

                      return (
                        <div
                          key={u.path}
                          role="button"
                          tabIndex={0}
                          onClick={() => userId && setSelectedOwnerId(userId)}
                          onKeyDown={() => userId && setSelectedOwnerId(userId)}
                          className={`p-2 cursor-pointer ${selectedOwnerId === userId ? 'bg-accent' : ''}`}
                        >
                          <div className="font-medium">{u.label}</div>
                          <div className="text-xs text-muted-foreground">{u.sublabel}</div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground">{t`No users found`}</div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  <Trans>Cancel</Trans>
                </Button>
                <Button type="submit" loading={isCreating}>
                  <Trans>Create</Trans>
                </Button>
              </div>
            </fieldset>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminOrganisationCreateForAdminDialog;
