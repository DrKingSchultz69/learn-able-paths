import { useState } from "react";
import { useAuth, User } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [age, setAge] = useState(String(user?.age ?? ""));
  const [role, setRole] = useState(user?.role ?? "Student");

  if (!user) return null;

  const handleSave = () => {
    updateUser({ name, age: parseInt(age), role });
    toast.success("Profile updated!");
  };

  return (
    <div className="container max-w-md py-10 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <div className="space-y-4">
        <div>
          <Label>Email</Label>
          <Input value={user.email} disabled className="opacity-60" />
        </div>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div>
          <Label>Role</Label>
          <Select value={role} onValueChange={(v) => setRole(v as User["role"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Student">Student</SelectItem>
              <SelectItem value="Parent">Parent</SelectItem>
              <SelectItem value="Teacher">Teacher</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="pt-2 flex items-center gap-3 text-sm text-muted-foreground">
          <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
        <Button onClick={handleSave} className="w-full" size="lg">Save Changes</Button>
      </div>
    </div>
  );
}
