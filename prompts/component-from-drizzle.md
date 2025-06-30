Create a component based on a Drizzle model to see the data using the Shadcn UI components.

**Input**
The user need to give you the Drizzle model name if not, ask for it.

**Output**
A valid React component with the correct types based on the Drizzle model.

You will show a Card preview with the Drizzle model name, and the field.

You will show the field using icon from Lucide-React, you will left align the field name and icon, right align the value.

Here is the import example

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Icon } from "lucide-react";
```
